import Abs from '../../abyss';

const limitNumber = length => value => {
    if (value) {
        // 整数限制
        value = value.toString();
        if (1 === value.length) {
            value = value.replace(/[^0-9]/g, "");
        } else {
            value = value.replace(/\D/g, "");
        }
        // 长度限制
        if (0 < length) {
            if (length < value.length) {
                value = value.substring(0, length);
            }
        }
        value = Abs.isNumber(value) ? parseInt(value, 10) : value;
    }
    return value;
};
const limitPInteger = length => value => {
    if (value) {
        // 正整数限制
        value = value.toString();
        if (1 === value.length) {
            value = value.replace(/[^1-9]/g, "");
        } else {
            value = value.replace(/\D/g, "");
        }
        // 长度限制
        if (0 < length) {
            if (length < value.length) {
                value = value.substring(0, length);
            }
        }
        value = Abs.isNumber(value) ? parseInt(value, 10) : value;
    }
    return value;
};
const limitLength = length => value => {
    if (value) {
        // 长度限制
        if (0 < length) {
            if (length < value.length) {
                value = value.substring(0, length);
            }
        }
    }
    return value;
};
const limitDecimal = (length, scale = 2) => value => {
    if (value) {
        // 2.正数输入限制
        value = value.toString();
        value = value.replace(/[^\d.]/g, ""); //清除“数字”和“.”以外的字符
        value = value.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
        value = value
            .replace(".", "$#$")
            .replace(/\./g, "")
            .replace("$#$", ".");
        const scaleReg = new RegExp(`(\\-)*(\\d+)\\.(\\d{${scale}}).`);
        value = value.replace(scaleReg, `$1$2.$3`); //只能输入两个小数
        // 3.长度输入限制
        if (length < value.length) {
            value = value.substring(0, length);
        }
        // 4.最终数据成型
        value = Abs.isDecimal(value) ? parseFloat(value) : value;
    }
    return value;
};
export default {
    decimal: limitDecimal,
    number: limitNumber,
    integer: limitPInteger,
    length: limitLength
};