import Ux from "ux";
import U from 'underscore';
import To from './func.to.date';

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
const toMessage = (content, error = false) => {
    if (content) {
        const config = {};
        config.modal = {};
        if (error) {
            config.modal.error = {content};
        } else {
            config.modal.success = {content};
        }
        return config;
    }
};
const toGrid = (config = {}) => {
    const {grid = 3} = config;
    const style = {};
    switch (grid) {
        case 5:
            style.width = "20%";
            break;
        case 4:
            style.width = "25%";
            break;
        case 3:
            style.width = "33.33%";
            break;
        case 2:
            style.width = "50%";
            break;
        case 1:
            style.width = "100%";
            break;
        default: {
            console.error("[OX] 暂时不支持该值：", grid);
            break;
        }
    }
    return style;
};
const toHeight = (adjust = 0) => {
    const style = {};
    const height = document.body.clientHeight;
    style.maxHeight = height - adjust;
    style.overflow = "auto";
    return style;
};
export default {
    toUri,
    toDialog,
    toMessage,
    toGrid, // Grid 转换
    toHeight,   // 高度计算
    ...To,
}