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

const COLORS = [
    "#48aaf7",
    "#d00036",
    "#44bc78",
    "#030f1f",
    "#e79627",
    "#7d4ab8",
    "#70d5fe",
    "#7077eb"
];
const toColor = (current) => {
    if (undefined === current) {
        const index = Ux.randomInteger(0, COLORS.length);
        return COLORS[index];
    } else {
        const index = current % COLORS.length;
        return COLORS[index];
    }
};
/*
 * 搜索 module 中对应的 ID 信息
 */
const toModelId = (reference, field) => {
    const inited = Ux.ambiguityObject(reference, "$inited");
    const module = Ux.fromHoc(reference, "module");
    if (module[field]) {
        const config = module[field];
        const modelId = Ux.isEmpty(inited) ? "__DEFAULT__" : inited['modelId'];
        if (config) return config[modelId];
    }
};
export default {
    toUri,
    toDialog,
    toNamespace,
    toColor,
    toModelId
}