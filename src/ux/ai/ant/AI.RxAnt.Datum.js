import U from "underscore";
// 包导入
import Random from "../../util/";
import Prop from '../../prop';
// 文件导入
import Expr from "../expr/AI.Expr.String";
import E from "../../Ux.Error";
import Type from '../../Ux.Type';
import Value from '../../Ux.Value';

const _parseData = (reference, config = {}) => {
    // 源头
    let value = null;
    if ("form" === config.source) {
        value = Prop.formGet(reference, config.field);
    } else {
        // TODO: 其他读取数据方式
    }
    if ("integer" === config.type) {
        value = Value.valueInt(value);
    } else if ("decimal" === config.type) {
        value = Value.valueFloat(value);
    }
    return value;
};

const parseFilter = (reference, filter = () => true) => {
    const filters = {};
    if ("string" === typeof filter) {
        const processed = Expr.aiExprFilter(filter);
        if (!processed.type) processed.type = "string";
        if (processed.field) {
            if (!processed.cond) processed.cond = processed.field;
            delete processed.key;
            const value = _parseData(reference, processed);
            if (undefined !== value) {
                filters[processed.cond] = value;
            }
        }
    }
    return filters;
};

const parseExpr = (expr = "") => {
    const item = expr.replace(/ /g, '');
    const kv = item.split(',');
    const attr = {};
    kv.forEach(keyValue => {
        const key = keyValue.split('=')[0];
        attr[key] = keyValue.split('=')[1];
    });
    if (!attr.hasOwnProperty('key')) {
        attr.key = Random.randomString(12);
    }
    return attr;
};

const parseDatum = (config = {}) => {
    let meta = config.datum;
    if ("string" === typeof config.datum) {
        meta = parseExpr(config.datum);
    }
    return meta;
};

/**
 * 过滤器处理
 * @param reference
 * @param filter
 */
const gainDatum = (reference, config = {}, filter = () => true) => {
    let options = [];
    // 如果存在datum节点，则从Assist/Tabular数据源中读取
    const {source} = parseDatum(config);
    if (source && "string" === typeof source) {
        const processed = parseFilter(reference, filter);
        let filterData = {};
        if (0 < Object.keys(processed).length) {
            // 包含了Filter信息
            Object.assign(filterData, processed);
        }
        const data = Type.elementFindDatum(reference, source,
            0 < Object.keys(filterData).length ? filterData : {});
        E.fxTerminal(!U.isArray(data), 10043, source);
        if (U.isFunction(processed)) {
            options = data.filter(processed);
        } else {
            options = data;
        }
    } else {
        E.fxTerminal(true, 10044, source);
    }
    return options;
};
const gainTree = (config = {}) => {
    let mapping = {};
    if (config.tree) {
        mapping = Value.valuePair(config.tree);
    }
    if (!mapping.id) mapping.id = "id";
    if (!mapping.pid) mapping.pid = "pid"; // 父节点
    if (!mapping.title) mapping.title = "code"; // 编码
    if (!mapping.value) mapping.value = "id"; // 主键和值
    if (!mapping.leaf) mapping.leaf = "leaf"; // 叶节点处理
    return mapping;
};
export default {
    parseExpr,
    parseDatum,
    parseFilter,
    gainDatum,
    gainTree
};