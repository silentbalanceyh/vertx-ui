import __Zn from 'zone';

/**
 * ## 「标准」`Ux.mathMultiplication`
 *
 * 数学乘法运算，该运算优于原始运算点：
 *
 * 1. 任何数据都可以使用默认值执行乘法（1乘任何数为1）。
 * 2. 不论 undefined, null 都可以执行乘法。
 *
 * @memberOf module:math/zone
 * @param {Number|String} seed 计算的乘数（种子值）。
 * @param {any[]} ops 被乘数构造的值和字符串数组。
 * @return {Number} 乘积。
 */
const mathMultiplication = (seed, ...ops) =>
    __Zn.mathMultiplication.apply(this, [seed].concat(ops));


/**
 * ## 「标准」`Ux.mathDivision`
 *
 * 数学除法运算，该运算可执行任何除法，包括 undefined 和 null，最终执行判断。
 *
 * > 注：零除会抛出严重错误。
 *
 * @memberOf module:math/zone
 * @param {Number|String} dividend 被除数
 * @param {Number|String} divisor 除数
 * @return {Number} 商
 */
const mathDivision = (dividend, divisor) =>
    __Zn.mathDivision(dividend, divisor);


/**
 * ## 「标准」`Ux.mathSum`
 *
 * 双值求和：数学计算中的双值求和。
 *
 * @memberOf module:math/zone
 * @param {String|Number} left 加数。
 * @param {String|Number} right 另外一个加数。
 * @param {Boolean} isFloat 是否执行浮点运算
 * @return {number} 和。
 */
const mathSum = (left, right, isFloat = false) =>
    __Zn.mathSum(left, right, isFloat);
/**
 * ## 「标准」`Ux.mathDiscount`
 *
 * 求折扣专用函数：计算折扣信息，最终得到 `5折、9.5折` 等之中的数值信息。
 *
 * @memberOf module:math/zone
 * @param {String|Number} up 分子数据。
 * @param {String|Number} down 分母数据。
 * @return {Number} 返回最终带一位小数位的折扣数值。
 */
const mathDiscount = (up, down) => __Zn.mathDiscount(up, down);
/**
 * ## 「标准」`Ux.mathSubtract`
 *
 * 双值求差：数学计算中的双值求差。
 *
 * @memberOf module:math/zone
 * @param {String|Number} left 加数。
 * @param {String|Number} right 另外一个加数。
 * @param {Boolean} isFloat 是否执行浮点运算
 * @return {number} 和。
 */
const mathSubtract = (left, right, isFloat = false) =>
    __Zn.mathSubtract(left, right, isFloat);
export default {
    mathDivision,
    mathMultiplication,
    mathSum,
    mathSubtract,
    mathDiscount,
};