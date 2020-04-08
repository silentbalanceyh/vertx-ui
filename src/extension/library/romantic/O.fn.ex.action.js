import Ux from 'ux';
import U from 'underscore';

/**
 * ## 扩展函数
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
 * @memberOf module:_romantic
 * @param {ReactComponent} reference React对应组件引用。
 * @param {String} key 被读取的配置键值。
 * @param {ReactComponent} Component 组件类型。
 * @returns {Object} 处理过后的 Action 相关配置。
 */
const sexExAction = (reference, key, Component) => {
    const config = Ux.sexCab(reference, key);
    if (U.isArray(config)) {
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

export default sexExAction