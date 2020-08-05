import Ux from 'ux';
import Ex from 'ex';
import Opt from '../options';
import U from 'underscore';
import standardPlugin from '../Web.Plugin';
import parserOfEvent from './I.state.async.parser';

import Plugin from 'plugin';

const {Op} = Opt;
export default (reference, config = {}, state) => {
    const {options = {}, component = {}} = config;
    const eventParser = parserOfEvent(reference);
    const buttonParser = Ex.parserOfButton(reference);
    const pluginComponent = Ux.clone(standardPlugin);
    /*
     * 扩展包 Plugin.Extension 中的插件会覆盖标准插件
     */
    Object.keys(Plugin.Extension).filter(field => field.startsWith("Ex"))
        .forEach(field => pluginComponent[field] = Plugin.Extension[field]);
    return new Promise((resolve) => {
        if (options[Ex.Opt.DYNAMIC_OP]) {
            /* 动态 Op */
            const identifier = options.identifier;
            if (identifier) {
                /*
                 * 特殊权限
                 */
                Ex.I.ops({identifier, type: "OP"}).then(response => {
                    /*
                     * 处理核心 List 问题
                     */
                    Ux.aclOp(state.options, response);
                    const result = {};
                    response.forEach(item => result[item['clientKey']] = result[item.text]);
                    resolve(result);
                });
            } else {
                /*
                 * 什么权限都没有
                 */
                console.error("对不起，没有 identifier，无法读取权限！");
                resolve({});
            }
        } else {
            /* 静态 Op */
            const opts = Ux.clone(options);
            /* 过滤 `op.` 打头的 */
            const result = {};
            Object.keys(opts).filter(opKey => opKey.startsWith('op.'))
                .forEach(opKey => result[opKey] = opts[opKey]);
            resolve(result);
        }
    })
        /* 初始化buttons */.then((ops = {}) => {
            /* 转换按钮处理 */
            const buttons = {};
            Object.keys(ops)
                .filter(opKey => !!opKey)
                .filter(opKey => "string" === typeof opKey)
                .filter(opKey => Op.hasOwnProperty(opKey))
                .forEach(opKey => {
                    let button = Ux.clone(Op[opKey]);
                    button.id = button.key;         // 同步前端和后端专用
                    button.text = ops[opKey];
                    if (!button.plugin) button.plugin = {};
                    button.category = opKey;
                    buttons[opKey] = button;
                });
            /* 按钮转换处理，扩展 op.extension.generate */
            const {$op = {}} = reference.props;
            if (!Ux.isEmpty($op)) {
                Object.keys(ops)
                    .filter(opKey => !!opKey)
                    .filter(opKey => "string" === typeof opKey)
                    .filter(opKey => opKey.startsWith('op.extension'))
                    .forEach(opKey => {
                        const op = Ux.clone(ops[opKey]);
                        /*
                         * 抽取 region / executor 两个值以处理
                         * 对应区域的 onClick 事件
                         */
                        const {config = {}} = op;
                        if (config.executor && $op.hasOwnProperty(config.executor)) {
                            let rxClick = $op[config.executor];
                            if (U.isFunction(rxClick)) {
                                rxClick = rxClick(reference, Ux.clone(config));
                                if (U.isFunction(rxClick)) {
                                    op.onClick = rxClick;
                                }
                            }
                        }
                        buttons[opKey] = op;
                    });
            }
            return Ux.promise(buttons);
        })
        /* 按钮配置解析 */.then((buttons = {}) => buttonParser.parsePlugin(buttons, options))
        /* 组件解析 */.then((buttons = {}) => buttonParser.parseComponent(buttons, options, {
            config: component,
            plugin: pluginComponent
        }))
        /* 权限控制统一处理 */.then((buttons = {}) => eventParser.parseAuthorized(buttons, options))
        /* 绑定按钮事件 */.then((buttons = {}) => eventParser.parseEvent(buttons, options))
}