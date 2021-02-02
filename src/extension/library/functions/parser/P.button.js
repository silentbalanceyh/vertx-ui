import Ux from "ux";
import Gb from '../global';
import tplOp from './I.list.options';

import Ajx from '../../ajax';

const toAsync = (result, async = true) => {
    if (async) {
        if (Promise.prototype.isPrototypeOf(result)) {
            /* 本身异步 */
            return result.then(response => Ux.promise(response))
        } else {
            /* 本身同步 */
            return Ux.promise(result);
        }
    } else {
        return result;
    }
};
/*
 * 传入的 ops 必须是一个对象，每个 key 都会最终生成 category 属性
 */
const parsePlugin = (buttons = {}, options = {}) => {
    Ux.itValue(buttons, (button = {}) => {
        const {plugin = {}} = button;
        const configuration = {};
        /* 启用 tooltip 的button专用 */
        if (plugin.tooltip) {
            configuration.tooltip = true;
        }
        /* 启用 confirm 功能 */
        if (plugin.confirm) {
            configuration.confirm = options[plugin.confirm];
        }
        /* 启用 prompt 功能 */
        if (plugin.prompt) {
            configuration.prompt = options[plugin.prompt];
        }
        /* 启用 connect 功能 */
        if (plugin.connect) {
            configuration.connect = options[plugin.connect];
        }
        /* 启用 message 功能 */
        if (plugin.message) {
            configuration.message = options[plugin.message];
        }
        return configuration;
    }, 'plugin');
    return buttons;
};
const _parseContainer = (component = {}, plugin = {}, options = {}) => {
    /* 连接 window, confirm, popover, drawer */
    if (plugin.window) {
        component.type = "WINDOW";
        const literal = options[plugin.window];
        component.dialog = Ux.aiExprWindow(literal);
    } else if (plugin.popover) {
        component.type = "POPOVER";
        const literal = options[plugin.popover];
        component.dialog = Ux.aiExprPopover(literal);
    } else if (plugin.drawer) {
        component.type = "DRAWER";
        const literal = options[plugin.drawer];
        component.dialog = Ux.aiExprDrawer(literal);
    } else {
        component.type = "NONE";
    }
    return component;
};
const parseComponent = (buttons = {}, options = {}, components = {}) => {
    Ux.itValue(buttons, (button = {}) => {
        const Jsx = components.plugin;
        const config = components.config;
        if (Jsx && config) {
            const {plugin = {}} = button;
            let component;
            if (plugin.componentType) {
                /* 初始化组件配置 */
                component = {
                    component: Jsx[plugin.componentType]
                };
                if (config.hasOwnProperty(plugin.component)) {
                    component.config = config[plugin.component];
                } else {
                    component.config = {};
                }
                /*
                 * component合法
                 */
                component = _parseContainer(component, plugin, options);
            }
            return component;
        }
    }, 'component');
    return buttons;
};
const parseControl = (config = [], options = {}) => {
    const {type} = options;
    if ("LIST" === type) {
        const {ops = []} = options;
        if (config.options) {
            ops.forEach(op => {
                const item = {};
                item.key = op['clientKey'];
                config.options[item.key] = op['text'];
            });
        }
    } else if ("FORM" === type) {
        const {ops = []} = options;
        if (config.form) {
            const op = {};
            const event = {};
            ops.forEach(each => {
                // 先嫁接 op
                op[each['clientKey']] = each['action'];
                event[each['clientKey']] = {
                    event: each.event,
                    config: each.config ? each.config : {}
                };  // 处理 event
            });
            config.form.op = op;
            // event 专用信息
            if (!Ux.isEmpty(event)) {
                config.event = event;
            }
        }
    }
    return config;
};
/*
 * 这里的 options 执行合并
 * options + state.options 构造新的 options实现
 */
const parseOp = (config = [], options = {}, reference) => new Promise((resolve) => {
    if (options[Gb.Opt.DYNAMIC_OP]) {
        /*
         * 动态 Op
         */
        const identifier = options.identifier;
        if (identifier) {
            /*
             * 特殊权限
             */
            Ajx.ops({identifier, type: "OP"})
                /*
                 * 处理核心 List 问题
                 */
                .then(response => resolve(Ux.aclOp(options, response)))
        } else {
            /*
             * 无权限配置
             */
            console.error("对不起，没有合法的 identifier，无法读取权限！");
            resolve({});
        }
    } else {
        /* 静态 Op */
        const opts = Ux.clone(options);
        /* `op.` 打头的操作直接过滤 */
        const ops = {}
        Object.keys(opts)
            .filter(opKey => opKey.startsWith('op.'))
            .forEach(opKey => ops[opKey] = opts[opKey]);
        resolve(ops);
    }
}).then((ops = {}) => {
    /*
     * 基础按钮转换处理
     */
    const buttons = {};
    Object.keys(ops)
        .filter(opKey => !!opKey)
        .filter(opKey => "string" === typeof opKey)
        .filter(opKey => tplOp.hasOwnProperty(opKey))
        .forEach(opKey => {
            const button = Ux.clone(tplOp[opKey]);
            button.id = button.key;                     // 前后端主键同步
            button.text = ops[opKey];
            if (!button.plugin) button.plugin = {};      // 插件
            button.category = opKey;
            buttons[opKey] = button;
        });

    /*
     * 扩展OP专用：op.extension
     */
    const {$op = {}} = reference.props;
    Object.keys(ops)
        .filter(opKey => !!opKey)
        .filter(opKey => "string" === typeof opKey)
        .filter(opKey => opKey.startsWith('op.extension'))
        .forEach(opKey => {
            /*
             * 执行区域专用
             * 1. 带有 connectId
             * 2. 带有 executor
             * 这里只需要执行 onClick 注入就可以
             */
            const op = Ux.clone(ops[opKey]);
            const {config = {}} = op;
            if (config.executor || config.connectId) {
                /*
                 * 执行 onClick 函数级别的操作
                 * 1. 第一种是直接构造 executor 级别
                 * 2. 第二种是 connectId 注入
                 */
                let onClick;
                if (config.executor) {
                    const onClickFn = $op[config.executor];
                    if (Ux.isFunction(onClickFn)) {
                        onClick = onClickFn(reference, Ux.clone(config))
                    }
                } else if (config.connectId) {
                    onClick = () => Ux.connectId(config.connectId);
                }
                if (Ux.isFunction(onClick)) {
                    op.onClick = onClick;
                }
            }
            buttons[opKey] = op;
        });
    return Ux.promise(buttons);
})
/**
 * ## 扩展函数
 *
 * 生成按钮专用解析器，返回对象结构如（每个键都是函数）：
 *
 * ```js
 * {
 *     parsePlugin: () => "按钮插件解析函数",
 *     parseComponent: () => "组件解析函数",
 *     parseControl: () => "按钮本身解析函数，解析不同组件专用，LIST, FORM 不同"
 * }
 * ```
 *
 * @memberOf module:_parser
 * @method parserOfButton
 * @param {ReactComponent} reference React对应组件引用
 * @returns {Object}
 */
export default (reference) => ({
    parsePlugin: (buttons = {}, options = {}, async = true) => toAsync(parsePlugin(buttons, options), async),
    parseComponent: (buttons = {}, options = {}, component = {}, async = true) => toAsync(parseComponent(buttons, options, component), async),
    parseControl: (config = [], options = {}, async = true) => toAsync(parseControl(config, options), async),
    /* 异步解析 */
    parseOp: (config = [], options = {}) => parseOp(config, options, reference)
})