import numeral from 'numeral';

/**
 * 将传入值格式化成货币格式，该方法不带货币符号
 * @method fmtCurrency
 * @param value
 * @return {*}
 */
const fmtCurrency = (value) => {
    numeral.defaultFormat(`0,0.00`);
    return numeral(value).format();
};
/**
 * 将传入值格式化成带百分比的字符串
 * @method fmtPercent
 * @param value
 * @return {*}
 */
const fmtPercent = (value) => {
    numeral.defaultFormat("0.00%");
    return numeral(value).format();
};
/**
 * @class Format
 * @description 格式化专用函数
 */
export default {
    fmtCurrency,
    fmtPercent
};
