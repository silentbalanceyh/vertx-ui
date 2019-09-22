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
/*
 * 二义性函数
 * 1）传入是 string， 直接来
 * 2）传入是 非 string，走 React
 */
const toNamespace = (reference) => {
    if ("string" === typeof reference) {
        return `cn.originx.${reference}`;
    } else {
        const {$app} = reference.props;
        if ($app && $app.is()) {
            const name = $app._('name');
            if (name && "string" === typeof name) {
                return toNamespace(name);
            } else {
                console.error("[ Ex ] 应用数据有问题！", $app.to());
            }
        } else {
            console.error("[ Ex ] 未捕捉到应用信息！", reference.props);
        }
    }
};
export default {
    toUri,
    toDialog,
    toNamespace,
}