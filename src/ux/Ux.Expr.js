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

export default {
    // 表达式格式化，用于格式化两种表达式：
    // 1）带有{0}，{1}这种
    // 2）带有{name}，{email}这种
    formatExpr,
    // 处理QueryString的格式化，主要用于链接格式化
    formatQuery,
    // 时间格式化
    formatDate : (value, pattern = "YYYY-MM-DD") => moment(value).format(pattern),
    // 时间格式化
    formatNow : (pattern = "YYYY-MM-DD") => moment().format(pattern)
}
