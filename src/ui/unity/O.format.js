import moment from 'moment';
import numeral from 'numeral';
import Random from './O.random';
import Abs from '../abyss';
import Ele from '../element';

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


/**
 * ## 「标准」`Ux.formatExpr`
 *
 * 格式化字符串，将:x，:y使用params进行参数替换
 * 比如：/api/test/:name和{name:"lang"}两个合并成 => /api/test/lang
 *
 * @memberOf module:_unity
 * @param {String} input 原始字符串。
 * @param {Object} params 传入参数。
 * @param {Boolean} keep 是否保持原始key。
 * @return {String} 格式化表达式过后的值。
 */
const formatExpr = (input = "", params, keep = false) => {
    // 无参数直接返回input
    if (params) {
        // 如果是数组，则直接使用{0}，{1}这种格式进行格式化
        if (Array.prototype.isPrototypeOf(params)) {
            input = _unityArray(input, params, keep);
        } else {
            input = _unityNamed(input, params, keep);
        }
    }
    return input;
};

/**
 * ## 「标准」`Ux.formatQuery`
 *
 * 将参数追加到Query String中生成完整的uri链接。
 *
 * @memberOf module:_unity
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
    // eslint-disable-next-line
    for (const key in params) {
        if (params.hasOwnProperty(key)) {
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
    return queryStr;
};

/**
 * ## 「标准」`Ux.formatObject`
 *
 * 将表达式`k1=value1,k2=value2,k3=value3`解析成对象。
 *
 * @memberOf module:_unity
 * @param {String} expr 表达式相关信息。
 * @param {boolean} appendKey 解析过程中是否追加`key`，该参数为true则表示没有`key`时追加。
 * @return {Object} 解析好的对象信息。
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
 * ## 「标准」`Ux.formatCurrency`
 *
 * 将传入值格式化成货币格式，该方法不带货币符号。
 *
 * @memberOf module:_unity
 * @param {Number|String} value 输入的数值。
 * @return {String} 返回最终格式化过后的货币格式，可以和货币单位连用，取2位小数。
 */
const formatCurrency = (value) => {
    numeral.defaultFormat(`0,0.00`);
    return numeral(value).format();
};
/**
 * ## 「标准」`Ux.formatPercent`
 *
 * 将传入值格式化成带百分比的字符串，该方法返回结果带百分号。
 *
 * @memberOf module:_unity
 * @param {Number|String} value 输入的将要被格式化的值。
 * @return {String} 返回最终格式化的结果（百分比）。
 */
const formatPercent = (value) => {
    numeral.defaultFormat("0.00%");
    return numeral(value).format();
};
/**
 * ## 「标准」`Ux.formatTpl`
 *
 * 使用数据填充模板生成最终带数据的合并格式。
 *
 * ```js
 *
 * const state = {};
 * const user = Ux.isLogged();
 * const config = Ux.fromHoc(reference, "account");
 * if (!user.icon) user.icon = `image:${ImgPhoto}`;
 * const empty = Ux.fromHoc(reference, "empty");
 * if (!user.workNumber) user.workNumber = empty;
 * if (!user.workTitle) user.workTitle = empty;
 * if (!user.workLocation) user.workLocation = empty;
 * // 根据模板格式化相关数据
 * const data = Ux.formatTpl(user, config);
 * state.$data = Ux.clone(data);
 * state.$ready = true;
 * reference.setState(state);
 *
 * ```
 * @memberOf module:_unity
 * @param {Object} data 数据基础信息。
 * @param {Object} tpl 模板信息。
 * @return {any|*} 返回最终生成结果。
 */
const formatTpl = (data, tpl = {}) => {
    if (data) {
        const $tpl = Abs.clone(tpl);
        return Ele.ambKv($tpl,
            (expr) => formatExpr(expr, data, true));
    } else {
        /* 没有传入值直接不做 */
        return data;
    }
};
export default {
    formatTpl,
    // 直接根据 tpl 将数据执行转换
    formatCurrency,
    formatPercent,
    // 转换成 Object
    formatObject,
    formatExpr,
    formatQuery,
    /**
     * ## 「标准」`Ux.formatDate`
     *
     * 格式化时间字符串或时间值。
     *
     * @memberOf module:_unity
     * @param {Moment|String} value 被格式化的字符串或Moment对象。
     * @param {String} pattern 时间使用的模式如：`YYYY-MM-DD`，必须是Moment支持格式。
     * @return {string} 返回格式化过后的标准时间格式。
     */
    formatDate: (value, pattern = "YYYY-MM-DD") => moment(value).format(pattern),
    /**
     *
     * ## 「标准」`Ux.formatNow`
     *
     * 按模式格式化当前时间。
     *
     * @memberOf module:_unity
     * @param {String} pattern 时间使用的模式如：`YYYY-MM-DD`，必须是Moment支持格式。
     * @return {string} 返回格式化过后的标准时间格式。
     */
    formatNow: (pattern = "YYYY-MM-DD") => moment().format(pattern)
};
