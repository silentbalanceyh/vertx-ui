/**
 * ## 标准函数
 *
 * 判断当前字符串中是否是`合法中文`。
 *
 * ```js
 * const item = "你好";
 * const isCn = Ux.isCn(item);  // 返回 true
 * ```
 *
 * @memberOf module:_is
 * @param {String} literal 输入的原始字符串
 * @returns {boolean} 匹配返回true，否则返回false
 */
const isCn = (literal) =>
    /.*[\u4e00-\u9fa5]+.*$/
        .test(literal);
/**
 * ## 标准函数
 *
 * 判断当前字符串是否是`合法整数`。
 *
 * ```js
 * const literal = "1233";
 * const isNumber = Ux.isNumber(literal);       // 返回 true
 * ```
 *
 * @memberOf module:_is
 * @param {String} literal 输入的原始字符串
 * @returns {boolean} 匹配返回true，否则返回false
 */
const isNumber = (literal) =>
    /^-?[1-9]\d*$/g
        .test(literal);

/**
 * ## 标准函数
 *
 * 判断当前字符串是否是`合法货币格式`
 *
 * ```js
 * const literal = "12.33";
 * const literal2 = "1,135.65";
 * const isDecimal = Ux.isDecimal(literal);     // 返回 true
 * const isDecimal2 = Ux.isDecimal(literal);    // 返回 true
 * ```
 *
 * @memberOf module:_is
 * @param {String} literal 输入的原始字符串
 * @returns {boolean} 匹配返回true，否则返回false
 */
const isCurrency = (literal) =>
    /^(([1-9]\d*)(\.\d{1,2})?)$|^(0\.0?([1-9]\d?))$/g
        .test(literal);

/**
 * ## 标准函数
 *
 * 判断当前字符串是否是`合法浮点数`
 *
 * ```js
 * const literal = "12.33";
 * const isFloat = Ux.isCurrency(literal);        // 返回 true
 * ```
 *
 * @memberOf module:_is
 * @param {String} literal 输入的原始字符串
 * @returns {boolean} 匹配返回true，否则返回false
 */
const isDecimal = (literal) =>
    /^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/
        .test(literal);
export default {
    isCn,       /* REG: 中文 */
    isNumber,   /* REG: 合法整数 */
    isDecimal,  /* REG: 合法浮点数 */
    isCurrency, /* REG: 合法货币 */
}