import Ux from "ux";

const toAsync = (result, async = true) => {
    if (async) {
        return Ux.promise(result);
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
const parseOps = (config = [], options = {}) => {
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
/**
 * ## 扩展函数
 *
 * 生成按钮专用解析器，返回对象结构如（每个键都是函数）：
 *
 * ```js
 * {
 *     parsePlugin: () => "按钮插件解析函数",
 *     parseComponent: () => "组件解析函数",
 *     parseOps: () => "按钮本身解析函数"
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
    parseOps: (config = [], options = {}, async = true) => toAsync(parseOps(config, options), async),
})