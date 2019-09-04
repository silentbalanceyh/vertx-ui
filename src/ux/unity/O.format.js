import moment from 'moment';
import numeral from 'numeral';
import Random from './O.random';
import Abs from '../abyss';
import Ele from '../element';

const _formatArray = (input = "", args = []) => {
    if (Array.prototype.isPrototypeOf(args) && 0 < args.length) {
        args.forEach((item, index) => {
            // 表达式开始带冒号:
            if (0 <= input.indexOf(":" + index) && undefined !== item) {
                let replaced = new RegExp(`\\:${index}`, "gm");
                input = input.replace(replaced, item);
            }
        });
    }
    return input;
};

const _formatNamed = (input = "", params = {}, keep = false) => {
    if (
        !Array.prototype.isPrototypeOf(params) &&
        0 < Object.keys(params).length
    ) {
        for (const key in params) {
            // 由于查询引擎中包含了 "" 的键值，所以需要做这种处理
            if (key && params.hasOwnProperty(key)) {
                const value = params[key];
                // 过滤掉 "" 的键
                if ("string" === typeof input &&
                    0 <= input.indexOf(":" + key) && undefined !== value) {
                    let replaced = new RegExp(`\\:${key}`, "gm");
                    input = input.replace(replaced, value);
                    if (!keep) {
                        delete params[key];
                    }
                }
            }
        }
    }
    return input;
};
/**
 * 格式化字符串，将:x，:y使用params进行参数替换
 * 比如：/api/test/:name和{name:"lang"}两个合并成 => /api/test/lang
 * @method formatExpr
 * @param {String} input 原始字符串
 * @param {Object} params 传入参数
 * @param {Boolean} keep 是否保持原始key
 * @return {String}
 */
const formatExpr = (input = "", params, keep = false) => {
    // 无参数直接返回input
    if (params) {
        // 如果是数组，则直接使用{0}，{1}这种格式进行格式化
        if (Array.prototype.isPrototypeOf(params)) {
            input = _formatArray(input, params, keep);
        } else {
            input = _formatNamed(input, params, keep);
        }
    }
    return input;
};
/**
 * 将参数追加到Query String中生成完整的uri链接。
 * @method formatQuery
 * @param {String} uri 被格式化编码的Uri
 * @param {Object} params 将要追加的Query参数值
 * @param {Boolean} encode 是否针对参数进行uri encode编码，默认是需编码的
 * @return {String}
 */
const formatQuery = (uri = "", params = {}, encode = true) => {
    let queryStr = "";
    // 已包含了问号，则直接追加之后的部分，连接符使用&
    let start = true;
    if (0 <= uri.indexOf("?")) {
        start = false;
    }
    for (const key in params) {
        if (params.hasOwnProperty(key)) {
            const value = params[key];
            if (value) {
                const kv = encode ? `${key}=${encodeURIComponent(value)}` : `${key}=${value}`;
                if (start) {
                    // 直接追加
                    queryStr += `?${kv}`;
                    start = false;
                } else {
                    // 从头追加
                    queryStr += `&${kv}`;
                }
            }
        }
    }
    return queryStr;
};

const formatFun = (field, params) => (row) => {
    // 第三参：keep = true
    row[field] = formatExpr(row[field], params, true);
    return row;
};
/*
 * k1=value1,k2=value2,k3=value3
 */
const formatObject = (expr = "", appendKey = false) => {
    /* 特殊表达式解析 */
    const item = expr.replace(/ /g, '');
    const kv = item.split(',');
    const attr = {};
    kv.forEach(keyValue => {
        const key = keyValue.split('=')[0];
        attr[key] = keyValue.split('=')[1];
    });
    if (appendKey) {
        if (!attr.hasOwnProperty('key')) {
            attr.key = Random.randomString(12);
        }
    }
    return attr;
};

/**
 * 将传入值格式化成货币格式，该方法不带货币符号
 * @method fmtCurrency
 * @param value
 * @return {*}
 */
const formatCurrency = (value) => {
    numeral.defaultFormat(`0,0.00`);
    return numeral(value).format();
};
/**
 * 将传入值格式化成带百分比的字符串
 * @method fmtPercent
 * @param value
 * @return {*}
 */
const formatPercent = (value) => {
    numeral.defaultFormat("0.00%");
    return numeral(value).format();
};
const formatTpl = (data, tpl = {}) => {
    if (data) {
        const $tpl = Abs.clone(tpl);
        return Ele.ambiguityKv($tpl,
            (expr) => formatExpr(expr, data, true));
    } else {
        /* 没有传入值直接不做 */
        return data;
    }
};
/**
 * @class Expr
 * @description 字符串格式化专用函数
 */
export default {
    formatTpl,
    // 直接根据 tpl 将数据执行转换
    formatCurrency,
    formatPercent,
    // 转换成 Object
    formatObject,
    formatFun,
    // 表达式格式化，用于格式化两种表达式：
    // 1）带有:name，:field这种
    // 2）带有:icon，:field这种
    formatExpr,
    // 处理QueryString的格式化，主要用于链接格式化
    formatQuery,
    /**
     * 将传入时间进行格式化专用函数
     * @method formatDate
     * @param value 时间数值
     * @param {String} pattern 输出的时间格式
     * @return {String}
     */
    formatDate: (value, pattern = "YYYY-MM-DD") => moment(value).format(pattern),
    /**
     * 将当前时间格式化专用函数
     * @method formatNow
     * @param {String} pattern 输出的时间格式
     * @return {String}
     */
    formatNow: (pattern = "YYYY-MM-DD") => moment().format(pattern)
};
