import Ux from "ux";
import U from 'underscore';

const toUri = (uri = "", $app) => {
    const path = $app._("path") ? $app._("path") : Ux.Env['ROUTE'];
    let relatedPath = `${path}${uri}`;
    if (!relatedPath.startsWith('/')) {
        relatedPath = `/${relatedPath}`;
    }
    return relatedPath;
};

const toDialog = (dialog) => {
    const config = {};
    if (dialog) {
        if (U.isObject(dialog)) {
            Object.assign(config, Ux.clone(dialog));
        } else if ("string" === typeof dialog) {
            Object.assign(config, {content: dialog});
        }
    }
    return config;
};
export default {
    toUri,
    toDialog,
}