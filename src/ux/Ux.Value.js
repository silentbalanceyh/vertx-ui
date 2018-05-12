import moment from 'moment';
import Dg from './Ux.Debug';

/**
 * 读取非undefined的值，去掉undefined值相关信息
 * @method valueValid
 * @param {Object} data
 */
const valueValid = (data = {}) => {
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            const value = data[key];
            if (undefined === value) {
                delete data[key];
            }
        }
    }
};
/**
 * 不重复追加值到`item`对象中（包含则不设置）
 * @method valueAppend
 * @param item 被设置的对象引用
 * @param field 设置的字段名
 * @param value 设置的字段值
 */
const valueAppend = (item = {}, field = "", value) => {
    if (!item.hasOwnProperty(field)) {
        item[field] = value;
    }
};
/**
 * 直接转换数据成Moment对象，时间处理
 * @method convertTime
 * @param value 输入数据
 * @return {*}
 */
const convertTime = (value) => {
    if (value) {
        if (!moment.isMoment(value)) {
            value = moment(value);
            if (!moment.isMoment(value)) {
                console.error("[V] Convert 'value' to invalid 'Moment' object.");
            }
        }
        return value;
    } else {
        console.error("[V] The 'value' is undefined, could not be converted.");
    }
};
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
        console.info("[Math] dividend / divisor = ", dividend, divisor)
    }
};
/**
 * 根据from和to计算中间的duration差值
 * * years - y
 * * monthds -M
 * * weeks -w
 * * days - d
 * * hours - h
 * * minutes - m
 * * seconds - s
 * * milliseconds - ms
 * @method valueDuration
 * @param from 开始时间
 * @param to 结束时间
 * @param mode 计算模式
 */
const valueDuration = (from, to, mode = 'day') => {
    if (from && to) {
        from = convertTime(from);
        to = convertTime(to);
        return moment(to).diff(from, mode);
    } else {
        console.error("[V] Either 'from' or 'to' must not be undefined.");
    }
};
/**
 * 根据开始时间计算结束时间
 * @method valueEndTime
 * @param from 开始时间
 * @param duration 时差
 * @param mode 计算模式
 * @return {moment.Moment}
 */
const valueEndTime = (from, duration, mode = 'day') => {
    if (from && duration) {
        from = convertTime(from);
        Dg.ensurePositive(duration);
        return moment(from).add(duration, mode);
    } else {
        console.error("[V] Either 'from' or 'duration' must not be undefined.")
    }
};
/**
 * 根据结束时间计算开始时间
 * @method valueStartTime
 * @param to 结束时间
 * @param duration 时差
 * @param mode 计算模式
 * @return {moment.Moment}
 */
const valueStartTime = (to, duration, mode = 'day') => {
    if (to && duration) {
        to = convertTime(to);
        Dg.ensurePositive(duration);
        return moment(to).subtract(duration, mode);
    } else {
        console.error("[V] Either 'to' or 'duration' must not be undefined.")
    }
};
/**
 * 针对JavaScript中的对象进行过滤
 * @method valueFilter
 * @param data 被过滤的数据对象
 * @param keys 保留的字段名集合
 */
const valueFilter = (data = {}, keys = []) => {
    const result = {};
    keys.forEach(key => {
        if (data.hasOwnProperty(key)) {
            result[key] = data[key];
        }
    });
    return result;
};
/**
 * 两个字符串的专用连接方法，用于做不重复链接，
 * @method stringConnect
 * @private
 * @param left
 * @param right
 */
const stringConnect = (left, right) => {
    if (left && right && "string" === typeof left && "string" === typeof right) {
        if (right.startsWith(left)) {
            return right;
        } else {
            return left + right;
        }
    }
};
/**
 * @class Value
 * @description 数值计算器
 */
export default {
    stringConnect,
    valueValid,
    valueAppend,
    valueDuration,
    valueEndTime,
    valueStartTime,
    valueFilter,
    // 数学运算
    mathMultiplication,
    mathDivision,
    // 转换处理
    convertTime
}
