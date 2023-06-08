import __Zn from 'zone';


/**
 * ## 「标准」`Ux.formatExpr`
 *
 * 格式化字符串，将:x，:y使用params进行参数替换
 * 比如：/api/test/:name和{name:"lang"}两个合并成 => /api/test/lang
 *
 * @memberOf module:format/zone
 * @param {String|Object} input 原始字符串。
 * @param {Object} params 传入参数。
 * @param {Boolean} keep 是否保持原始key。
 * @return {String} 格式化表达式过后的值。
 */
const formatExpr = (input = "", params, keep = false) =>
    __Zn.formatExpr(input, params, keep);

/**
 * ## 「标准」`Ux.formatQuery`
 *
 * 将参数追加到Query String中生成完整的uri链接。
 *
 * @memberOf module:format/zone
 * @param {String} uri 被格式化编码的Uri
 * @param {Object} params 将要追加的Query参数值
 * @param {Boolean} encode 是否针对参数进行uri encode编码，默认是需编码的
 * @return {String}
 */
const formatQuery = (uri = "", params = {}, encode = true) =>
    __Zn.formatQuery(uri, params, encode);

/**
 * ## 「标准」`Ux.formatObject`
 *
 * 将表达式`k1=value1,k2=value2,k3=value3`解析成对象。
 *
 * @memberOf module:format/zone
 * @param {String} expr 表达式相关信息。
 * @param {boolean} appendKey 解析过程中是否追加`key`，该参数为true则表示没有`key`时追加。
 * @return {Object} 解析好的对象信息。
 */
const formatObject = (expr = "", appendKey = false) =>
    __Zn.formatObject(expr, appendKey);

/**
 * ## 「标准」`Ux.formatCurrency`
 *
 * 将传入值格式化成货币格式，该方法不带货币符号。
 *
 * @memberOf module:format/zone
 * @param {Number|String} value 输入的数值。
 * @return {String} 返回最终格式化过后的货币格式，可以和货币单位连用，取2位小数。
 */
const formatCurrency = (value) =>
    __Zn.formatCurrency(value);
/**
 * ## 「标准」`Ux.formatPercent`
 *
 * 将传入值格式化成带百分比的字符串，该方法返回结果带百分号。
 *
 * @memberOf module:format/zone
 * @param {Number|String} value 输入的将要被格式化的值。
 * @return {String} 返回最终格式化的结果（百分比）。
 */
const formatPercent = (value) =>
    __Zn.formatPercent(value);
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
 * @memberOf module:format/zone
 * @param {Object} data 数据基础信息。
 * @param {Object} tpl 模板信息。
 * @return {any|*} 返回最终生成结果。
 */
const formatTpl = (data, tpl = {}) =>
    __Zn.formatTpl(data, tpl);
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
     * @memberOf module:format/zone
     * @param {Dayjs|String} value 被格式化的字符串或Moment对象。
     * @param {String} pattern 时间使用的模式如：`YYYY-MM-DD`，必须是Moment支持格式。
     * @return {string} 返回格式化过后的标准时间格式。
     */
    formatDate: (value, pattern = "YYYY-MM-DD") =>
        __Zn.formatDate(value, pattern),
    /**
     *
     * ## 「标准」`Ux.formatNow`
     *
     * 按模式格式化当前时间。
     *
     * @memberOf module:format/zone
     * @param {String} pattern 时间使用的模式如：`YYYY-MM-DD`，必须是Moment支持格式。
     * @return {string} 返回格式化过后的标准时间格式。
     */
    formatNow: (pattern = "YYYY-MM-DD") =>
        __Zn.formatNow(pattern)
};
