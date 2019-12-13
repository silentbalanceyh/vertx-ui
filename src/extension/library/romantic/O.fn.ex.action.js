import Ux from 'ux';
import U from 'underscore';
/*
 * 输入格式
 *
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