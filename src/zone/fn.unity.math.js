import __E from './fn.debug.fx.error';
import __Vt from './fn.assort.value.typed';
import __Amb from './fn.assemble.amb.polysemy';

const mathMultiplication = (seed, ...ops) => {
    seed = parseFloat(seed);
    let result = isNaN(seed) ? 1.00 : seed;
    const opNorm = __Amb.ambArray.apply(null, ops);
    opNorm.forEach(op => {
        op = parseFloat(op);
        if (!isNaN(op)) {
            result *= op;
        }
    });
    return result;
};
const mathDivision = (dividend, divisor) => {
    dividend = parseFloat(dividend);
    divisor = parseFloat(divisor);
    if (!isNaN(dividend) && !isNaN(divisor) && 0 !== divisor) {
        return dividend / divisor;
    } else {
        __E.fxFatal(10029, dividend, divisor);
    }
};
const mathSum = (left, right, isFloat = false) => {
    if (isFloat) {
        const leftValue = __Vt.valueFloat(left);
        const rightValue = __Vt.valueFloat(right);
        return leftValue + rightValue;
    } else {
        const leftValue = __Vt.valueInt(left);
        const rightValue = __Vt.valueInt(right);
        return leftValue + rightValue;
    }
};
const mathDiscount = (up, down) => {
    const upValue = __Vt.valueFloat(up, 0.0);
    const downValue = __Vt.valueFloat(down, 0.0);
    if (upValue === downValue || 0 === downValue) {
        return 10;  // 无折扣
    } else {
        let divided = mathDivision(upValue, downValue);
        divided = divided * 10;
        return __Vt.valueFloat(divided.toFixed(1));
    }
};
const mathSubtract = (left, right, isFloat = false) => {
    if (isFloat) {
        const leftValue = __Vt.valueFloat(left);
        const rightValue = __Vt.valueFloat(right);
        return leftValue - rightValue;
    } else {
        const leftValue = __Vt.valueInt(left);
        const rightValue = __Vt.valueInt(right);
        return leftValue - rightValue;
    }
};
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    mathDivision,
    mathMultiplication,
    mathSum,
    mathSubtract,
    mathDiscount,
};