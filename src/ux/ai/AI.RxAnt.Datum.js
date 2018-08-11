import Expr from "./AI.Expr.String";
import Random from "../Ux.Random";
import E from "../Ux.Error";
import U from "underscore";
import Type from '../Ux.Type';
import Prop from '../Ux.Prop';
import Value from '../Ux.Value';

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
            if (value) {
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
export default {
    parseExpr,
    parseDatum,
    parseFilter,
    gainDatum
}