import moment from 'moment';

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

const _formatNamed = (input = "", params = {}) => {
    if (
        !Array.prototype.isPrototypeOf(params) &&
        0 < Object.keys(params).length
    ) {
        for (const key in params) {
            const value = params[key];
            if (0 <= input.indexOf(":" + key) && undefined !== value) {
                let replaced = new RegExp(`\\:${key}`, "gm");
                input = input.replace(replaced, value);
                delete params[key];
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
 * @return {String}
 */
const formatExpr = (input = "", params) => {
    // 无参数直接返回input
    if (params) {
        // 如果是数组，则直接使用{0}，{1}这种格式进行格式化
        if (Array.prototype.isPrototypeOf(params)) {
            input = _formatArray(input, params);
        } else {
            input = _formatNamed(input, params);
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
/**
 * @class Expr
 * @description 字符串格式化专用函数
 */
export default {
    // 表达式格式化，用于格式化两种表达式：
    // 1）带有{0}，{1}这种
    // 2）带有{name}，{email}这种
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
}
