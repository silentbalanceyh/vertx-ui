const isCn = (input) =>
    /.*[\u4e00-\u9fa5]+.*$/
        .test(input);
const isNumber = (literal) =>
    /^-?[1-9]\d*$/g
        .test(literal);
const isCurrency = (literal) =>
    /^(([1-9]\d*)(\.\d{1,2})?)$|^(0\.0?([1-9]\d?))$/g
        .test(literal);
const isDecimal = (literal) =>
    /^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/
        .test(literal);
export default {
    isCn,       /* REG: 中文 */
    isNumber,   /* REG: 合法整数 */
    isDecimal,  /* REG: 合法浮点数 */
    isCurrency, /* REG: 合法货币 */
}