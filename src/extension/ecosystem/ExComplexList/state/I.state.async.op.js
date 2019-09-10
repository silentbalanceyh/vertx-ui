import Ux from 'ux';
import Ex from 'ex';
import Opt from '../options';
import Plugin from '../Web.Plugin';
import parserOfEvent from './I.state.async.parser';

const {Op} = Opt;
export default (reference, config = {}) => {
    const {options = {}, component = {}} = config;
    const eventParser = parserOfEvent(reference);
    const buttonParser = Ex.parserOfButton(reference);
    return new Promise((resolve) => {
        if (options[Ex.Opt.DYNAMIC_OP]) {
            /* 动态 Op */

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
        return Ux.promise(buttons);
    })
    /* 按钮配置解析 */.then((buttons = {}) => buttonParser.parsePlugin(buttons, options))
    /* 组件解析 */.then((buttons = {}) => buttonParser.parseComponent(buttons, options, {
        config: component,
        plugin: Plugin
    }))
    /* 权限控制统一处理 */.then((buttons = {}) => eventParser.parseAuthorized(buttons))
    /* 绑定按钮事件 */.then((buttons = {}) => eventParser.parseEvent(buttons))
}