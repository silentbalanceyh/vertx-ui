import Ux from 'ux';

const toDialog = (dialog) => {
    const config = {};
    if (dialog) {
        if (Ux.isObject(dialog)) {
            Object.assign(config, Ux.clone(dialog));
        } else if ("string" === typeof dialog) {
            Object.assign(config, {content: dialog});
        }
    }
    return config;
};
/**
 * ## 「标准」`Ex.toFontSize`
 *
 * @memberOf module:to/utter
 * @returns {*}
 */
const toFontSize = () => {
    const replaced = Ux.Env['CSS_FONT'].replace(/px|em/g, "");
    return Ux.valueInt(replaced);
}
export default {
    toDialog,
    toFontSize,
}