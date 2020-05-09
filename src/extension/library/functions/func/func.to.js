import Ux from "ux";
import U from 'underscore';

/**
 * ## 扩展配置
 *
 * Uri专用配置处理，构造路径信息。
 *
 * @memberOf module:_to
 * @param {String} uri 原始路径信息
 * @param {DataObject} $app 应用程序对象
 * @returns {string} 返回最终的Uri信息
 */
const toUri = (uri = "", $app) => {
    let path;
    if ($app) {
        path = $app._("path") ? $app._("path") : Ux.Env['ROUTE'];
    } else {
        path = Ux.Env['ROUTE'];
    }
    let relatedPath = `${path}${uri}`;
    if (!relatedPath.startsWith('/')) {
        relatedPath = `/${relatedPath}`;
    }
    return relatedPath;
};
/**
 * ## 扩展函数
 *
 * 窗口配置生成函数
 *
 * @memberOf module:_to
 * @param {Object} dialog 窗口专用配置
 * @returns {Object} 处理后的配置
 */
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
/**
 * ## 扩展函数
 *
 * 名空间计算
 *
 * 1. 传入是 string， 直接来
 * 2. 传入是 非 string，走 React
 *
 * @memberOf module:_to
 * @param {ReactComponent} reference React对应组件引用
 * @returns {string|undefined} 返回合法名空间
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
/**
 * ## 扩展函数
 *
 * 1. 如果传入 current，则读取 current 上的颜色信息。
 * 2. 如果不传入 current，则随机读取颜色信息。
 *
 * @memberOf module:_to
 * @param {Number} current 索引数据
 * @returns {WebColor} 返回颜色值
 */
const toColor = (current) => {
    if (undefined === current) {
        const index = Ux.randomInteger(0, COLORS.length);
        return COLORS[index];
    } else {
        const index = current % COLORS.length;
        return COLORS[index];
    }
};
/**
 * ## 扩展函数
 *
 * 从 `module` 中提取配置信息，并执行 identifier 的计算。
 *
 * @memberOf module:_to
 * @param {ReactComponent} reference React对应组件引用
 * @param {String} field 字段信息
 * @returns {String} 返回最终的模型ID（统一标识符计算值）
 */
const toModelId = (reference, field) => {
    const inited = Ux.ambiguityObject(reference, "$inited");
    const module = Ux.fromHoc(reference, "module");
    if (module[field]) {
        const config = module[field];
        return toIdentifier(config, inited['modelId']);
    }
};
/**
 * ## 扩展函数
 *
 * 根据传入配置计算统一标识符
 *
 * 1. `__DEFAULT__`：默认的统一标识符，如果不存在则使用该值。
 * 2. `__PATTERN__`：执行 format 专用表达式解析转换。
 *
 * @memberOf module:_to
 * @param {Object} config 基本配置信息
 * @param {Object} program 编程专用配置信息
 * @returns {String} 返回最终的统一标识符
 */
const toIdentifier = (config = {}, program) => {
    if (Ux.isEmpty(config)) {
        throw new Error(" config 在解析 modelId 的时候不可为空，请检查！")
    } else {
        const defaultValue = config.__DEFAULT__ ? config.__DEFAULT__ : "__DEFAULT__";
        const identifier = program ? program : defaultValue;
        if (config.hasOwnProperty('__PATTERN__')) {
            const expr = config.__PATTERN__;
            return Ux.formatExpr(expr, {identifier});
        } else {
            return config[identifier];
        }
    }
};
export default {
    toUri,
    toDialog,
    toNamespace,
    toColor,
    toModelId,
    toIdentifier,
}