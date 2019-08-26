import It from '../func';
import toAsync from './P.async';
import Ux from "ux";
/*
 * 传入的 ops 必须是一个对象，每个 key 都会最终生成 category 属性
 */
const parsePlugin = (buttons = {}, options = {}) => {
    It.itValue(buttons, (button = {}) => {
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
    It.itValue(buttons, (button = {}) => {
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
export default (reference) => ({
    parsePlugin: (buttons = {}, options = {}, async = true) => toAsync(parsePlugin(buttons, options), async),
    parseComponent: (buttons = {}, options = {}, component = {}, async = true) => toAsync(parseComponent(buttons, options, component), async)
})