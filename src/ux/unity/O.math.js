import E from "../error";
import Ele from '../element';

/**
 * ## 标准函数
 *
 * 数学乘法运算，该运算优于原始运算点：
 *
 * 1. 任何数据都可以使用默认值执行乘法（1乘任何数为1）。
 * 2. 不论 undefined, null 都可以执行乘法。
 *
 * @memberOf module:_math
 * @param {Number|String} seed 计算的乘数（种子值）。
 * @param {any[]} ops 被乘数构造的值和字符串数组。
 * @return {Number} 乘积。
 */
const mathMultiplication = (seed, ...ops) => {
    seed = parseFloat(seed);
    let result = isNaN(seed) ? 1.00 : seed;
    ops.forEach(op => {
        op = parseFloat(op);
        if (!isNaN(op)) {
            result *= op;
        }
    });
    return result;
};
/**
 * ## 标准函数
 *
 * 数学除法运算，该运算可执行任何除法，包括 undefined 和 null，最终执行判断。
 *
 * > 注：零除会抛出严重错误。
 *
 * @memberOf module:_math
 * @param {Number|String} dividend 被除数
 * @param {Number|String} divisor 除数
 * @return {Number} 商
 */
const mathDivision = (dividend, divisor) => {
    dividend = parseFloat(dividend);
    divisor = parseFloat(divisor);
    if (!isNaN(dividend) && !isNaN(divisor) && 0 !== divisor) {
        return dividend / divisor;
    } else {
        E.fxFatal(10029, dividend, divisor);
    }
};
/**
 * ## 标准函数
 *
 * 双值求和：数学计算中的双值求和，当前版本仅支持整数。
 *
 * @memberOf module:_math
 * @param {String|Number} left 加数。
 * @param {String|Number} right 另外一个加数。
 * @return {number} 和。
 */
const mathSum = (left, right) => {
    const leftValue = Ele.valueInt(left);
    const rightValue = Ele.valueInt(right);
    return leftValue + rightValue;
};
/**
 * ## 标准函数
 *
 * 求折扣专用函数：计算折扣信息，最终得到 `5折、9.5折` 等之中的数值信息。
 *
 * @memberOf module:_math
 * @param {String|Number} up 分子数据。
 * @param {String|Number} down 分母数据。
 * @return {Number} 返回最终带一位小数位的折扣数值。
 */
const mathDiscount = (up, down) => {
    const upValue = Ele.valueFloat(up, 0.0);
    const downValue = Ele.valueFloat(down, 0.0);
    if (upValue === downValue || 0 === downValue) {
        return 10;  // 无折扣
    } else {
        let divided = mathDivision(upValue, downValue);
        divided = divided * 10;
        return Ele.valueFloat(divided.toFixed(1));
    }
};
export default {
    mathDivision,
    mathMultiplication,
    mathSum,
    mathDiscount,
};