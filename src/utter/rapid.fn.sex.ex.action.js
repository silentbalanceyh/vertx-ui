import Ux from "ux";
import __PLUGIN from 'plugin';

const sexExAction = (reference, key, Component) => {
    const config = Ux.sexCab(reference, key);
    if (Ux.isArray(config)) {
        return config.filter(Ux.isObject).map(each => sexExAction(reference, each));
    } else {
        const configuration = {};
        /*
         * dialog是
         */
        if (config.button) {
            const button = Ux.aiExprAction(config.button);
            if (button) {
                Object.assign(configuration, button);
                if (!configuration.id) {
                    configuration.id = configuration.key;
                }
            }
        }
        /*
         * dialog处理
         */
        if (config.dialog) {
            const dialog = Ux.aiExprWindow(config.dialog);
            const component = {};
            component.dialog = dialog;
            component.component = Component;
            component.type = "WINDOW";
            configuration.component = component;
        }
        return configuration;
    }
};
const sexExPlugin = (reference, options = {}, key) => {
    const pluginKey = options[key];
    if (pluginKey) {
        /*
         */
        let pluginFn = __PLUGIN.Function[pluginKey];
        if (Ux.isFunction(pluginFn)) {
            pluginFn = pluginFn(reference);
            if (Ux.isFunction(pluginFn)) {
                return pluginFn;
            }
        }
    } else {
        /*
         * 普通插件专用
         * metadata正式启用：
         * edition = true
         * deletion = true
         */
        return Ux.pluginMetadata;
    }
};
export default {
    sexExAction,
    sexExPlugin,
}