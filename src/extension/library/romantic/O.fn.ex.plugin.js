import Plugin from 'plugin';
import U from 'underscore';

export default (reference, options = {}, key) => {
    const pluginKey = options[key];
    if (pluginKey) {
        let pluginFn = Plugin[pluginKey];
        if (U.isFunction(pluginFn)) {
            pluginFn = pluginFn(reference);
            if (U.isFunction(pluginFn)) {
                return pluginFn;
            }
        }
    }
}