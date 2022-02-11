import Ux from "ux";
import Plugin from "plugin";

/**
 * ## 「快速」`Ex.sexExAction`
 *
 * 统一处理特殊带窗口操作按钮：
 *
 * ```json
 * {
 *     "button": {
 *
 *     },
 *     "dialog":{
 *
 *     }
 * }
 * ```
 *
 * @memberOf module:_kernel
 * @param {Object|ReactComponent} reference React对应组件引用。
 * @param {String} key 被读取的配置键值。
 * @param {Object|ReactComponent} Component 组件类型。
 * @returns {Object} 处理过后的 Action 相关配置。
 */
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

/**
 * ## 「快速」`Ex.sexExPlugin`
 *
 *
 * 如果出现了 pluginKey，则从 Plugin.Function 中读取函数
 * 该函数返回三种信息：
 *
 * ```json
 * {
 *     "selection": 自动计算，edition = true 并且 deletion = true 时可选择
 *     "edition": 默认 true（可编辑）
 *     "deletion": 默认 true（可删除）
 * }
 * ```
 *
 * > 限制，批量编辑和批量删除只能针对 edition / deletion 同时为true的时候，否则这种记录都不可能被批量操作选中
 *
 * @memberOf module:_kernel
 * @method sexExPlugin
 * @param {Object|ReactComponent} reference React对应组件引用。
 * @param {Object} options 插件配置选项。
 * @param {String} key 读取配置的键。
 * @returns {Function} 返回插件专用处理函数。
 */
const sexExPlugin = (reference, options = {}, key) => {
    const pluginKey = options[key];
    if (pluginKey) {
        /*
         */
        let pluginFn = Plugin.Function[pluginKey];
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
}
export default {
    sexExAction,
    sexExPlugin,
}