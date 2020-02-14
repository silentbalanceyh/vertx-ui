import E from "../error";
import Ele from '../element';
import Abs from '../abyss';

/**
 * 连续乘法专用乘法计算
 * @method mathMultiplication
 * @param seed 第一操作数
 * @param ops 其他操作数
 * @return {*}
 */
const mathMultiplication = (seed, ...ops) => {
    seed = parseFloat(seed);
    let result = isNaN(seed) ? 0.00 : seed;
    ops.forEach(op => {
        op = parseFloat(op);
        if (!isNaN(op)) {
            result *= op;
        }
    });
    return result;
};
/**
 * 专用除法运算
 * @method mathDivision
 * @param dividend 被除数
 * @param divisor 除数
 * @return {number}
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
 * 线性变化：
 * Object( key = Array ) => Array拉平
 * @param data
 * @param field
 */
const mathLinear = (data = {}, field) => {
    const array = [];
    Abs.itObject(data, (key, value) => {
        value.forEach(item => {
            if (item) {
                item[field] = key;
            }
            array.push(item);
        });
    });
    return array;
};
/**
 * 求和
 * @param left
 * @param right
 */
const mathSum = (left, right) => {
    const leftValue = Ele.valueInt(left);
    const rightValue = Ele.valueInt(right);
    return leftValue + rightValue;
};
/*
 * 1 折
 * .x 折
 * 9 折
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
    mathLinear,
    mathDivision,
    mathMultiplication,
    mathSum,
    mathDiscount,
};