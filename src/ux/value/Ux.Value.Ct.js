import U from "underscore";
import Immutable from "immutable";
import Random from "../util/Ux.Random";
import Sorter from "../util/Ux.Sorter";
import Debug from "../Ux.Debug";

/**
 * 针对JavaScript中的对象进行过滤
 * @method valueFilter
 * @param data 被过滤的数据对象
 * @param keys 保留的字段名集合
 * @param orderBy 排序字段
 */
const valueFilter = (data = {}, keys = [], orderBy = "order") => {
    const result = {};
    keys.forEach(key => {
        if (data.hasOwnProperty(key)) {
            result[key] = data[key].sort((left, right) => Sorter.sorterAsc(left, right, orderBy));
        }
    });
    return result;
};
const $FLIP = Immutable.fromJS(["fnOut", "reference", "config"]);
const valueFlip = (jsx = {}) => {
    const processed = {};
    Object.keys(jsx).filter(key => !$FLIP.contains(key))
        .forEach((field) => processed[field] = jsx[field]);
    return processed;
};
const valueKey = (item) => {
    if (item && U.isObject(item) && !item.key) {
        item.key = Random.randomUUID();
    }
};
const valueIcon = (literal = "") => {
    const item = {};
    if (0 < literal.indexOf(",")) {
        const textIcon = literal.replace(/ /g, '').split(',');
        item.text = textIcon[0];
        const iconStr = textIcon[1];
        item.iconStyle = {fontSize: 20};
        if (0 < iconStr.indexOf(":")) {
            const iconStyle = iconStr.split(":");
            item.icon = iconStyle[0];
            item.iconStyle.color = iconStyle[1];
        } else {
            item.icon = iconStr;
        }
    } else {
        item.text = literal;
    }
    return item;
};

/**
 * 读取非undefined的值，去掉undefined值相关信息
 * @method valueValid
 * @param {Object} data
 */
const valueValid = (data = {}, wild = false) => {
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            const value = data[key];
            if (U.isArray(value)) {
                value.forEach(item => valueValid(item, wild))
            } else if (U.isObject(value)) {
                valueValid(value, wild);
            } else {
                if (wild) {
                    // 空字符串、0，以及其他值
                    if (!value) {
                        delete data[key];
                    }
                } else {
                    if (undefined === value) {
                        delete data[key];
                    }
                }
            }
        }
    }
};

const valueInt = (literal = "", dft = 0) => {
    let ret = parseInt(literal, 10);
    if (isNaN(ret)) {
        ret = dft;
    }
    return ret;
};
const valueFloat = (liberal, dft = 0.0) => {
    let ret = parseFloat(liberal);
    if (isNaN(ret)) {
        ret = dft;
    } else {
        ret = ret.toFixed(2);
    }
    return ret;
};
const valueUnit = (literal = "") => {
    // 无百分号
    if (literal.endsWith("%")) {
        const item = literal.replace(/%/g, '');
        return valueFloat(item) / 100;
    }
};

/**
 * 不重复追加值到`item`对象中（包含则不设置）
 * @method valueAppend
 * @param item 被设置的对象引用
 * @param field 设置的字段名
 * @param value 设置的字段值
 */
const valueAppend = (item = {}, field = "", value) => {
    if (!item.hasOwnProperty(field)) {
        item[field] = value;
    }
};

const valueFunction = (actions = {}) => (params) => {
    const functions = {};
    if (actions) {
        Object.keys(actions).filter(item => U.isFunction(actions[item]))
            .forEach(item => {
                const executor = actions[item](params);
                if (U.isFunction(executor)) {
                    functions[item] = executor;
                }
            });
    }
    return functions;
};
const valuePair = (expr) => {
    let mapping;
    if ("string" === typeof expr) {
        mapping = {};
        expr.split(',').filter(kv => 0 < kv.indexOf('='))
            .forEach(kv => {
                const kvArr = kv.split('=');
                if (kvArr[0] && kvArr[1]) {
                    mapping[kvArr[0]] = kvArr[1];
                }
            })
    } else {
        if (expr && U.isObject(expr)) mapping = expr;
        if (!mapping) mapping = {};
    }
    return mapping;
};
export default {
    valueInt, // 整数转换
    valueUnit,
    valueFloat,
    valueValid,
    valueAppend,
    valueFilter,
    valueIcon,
    valueKey,
    valuePair,
    valueFunction,
    // 设置自定义控件的专用属性
    valueFlip,
    valueTrack: Debug.dgMonitor,
}