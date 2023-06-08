import numeral from 'numeral';
import dayjs from 'dayjs';
import __Is from './fn.under.is.decision';
import __A from './fn.atomic.foundation';
import __Ur from './fn.unity.random';
import __Amb from './fn.assemble.amb.polysemy';

const _unityArray = (input = "", args = []) => {
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

const _unityNamed = (input = "", params = {}, keep = false) => {
    if (
        !Array.prototype.isPrototypeOf(params) &&
        0 < Object.keys(params).length
    ) {
        // eslint-disable-next-line
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
const formatExpr = (input = "", params, keep = false) => {
    // 无参数直接返回input
    if (params) {
        if ("string" === typeof input) {
            // 如果是数组，则直接使用{0}，{1}这种格式进行格式化
            if (__Is.isArray(params)) {
                input = _unityArray(input, params, keep);
            } else {
                input = _unityNamed(input, params, keep);
            }
        } else if (__Is.isObject(input)) {
            const result = {};
            Object.keys(input).forEach(field => {
                const expr = input[field];
                if ("string" === typeof expr) {
                    result[field] = formatExpr(expr, params, true);
                } else {
                    result[field] = expr;
                }
            });
            return result;
        }
    }
    return input;
};
const formatQuery = (uri = "", params = {}, encode = true) => {
    let queryStr = "";
    // 已包含了问号，则直接追加之后的部分，连接符使用&
    let start = true;
    if (0 <= uri.indexOf("?")) {
        start = false;
    }
    // eslint-disable-next-line
    if (__Is.isObject(params)) {
        for (const key in params) {
            if (params.hasOwnProperty(key) && "$body" !== key) {
                const value = params[key];
                if (undefined !== value
                    && null !== value
                    && value.toString().length <= 40) {
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
    }
    return queryStr;
};
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
            attr.key = __Ur.randomString(12);
        }
    }
    return attr;
};
const formatCurrency = (value) => {
    numeral.defaultFormat(`0,0.00`);
    return numeral(value).format();
};
const formatPercent = (value) => {
    numeral.defaultFormat("0.00%");
    return numeral(value).format();
};
const formatTpl = (data, tpl = {}) => {
    if (data) {
        const $tpl = __A.clone(tpl);
        return __Amb.ambKv($tpl,
            (expr) => formatExpr(expr, data, true));
    } else {
        /* 没有传入值直接不做 */
        return data;
    }
};
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    formatTpl,
    // 直接根据 tpl 将数据执行转换
    formatCurrency,
    formatPercent,
    // 转换成 Object
    formatObject,
    formatExpr,
    formatQuery,
    formatDate: (value, pattern = "YYYY-MM-DD") => dayjs(value).format(pattern),
    formatNow: (pattern = "YYYY-MM-DD") => dayjs().format(pattern)
};
