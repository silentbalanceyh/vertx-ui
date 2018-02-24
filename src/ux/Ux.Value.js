import moment from 'moment';
import Dg from './Ux.Debug';

const valueAppend = (item = {}, field = "", value) => {
    if (!item.hasOwnProperty(field)) {
        item[field] = value;
    }
};
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
 * 根据from和to计算中间的duration差值
 * years - y
 * monthds -M
 * weeks -w
 * days - d
 * hours - h
 * minutes - m
 * seconds - s
 * milliseconds - ms
 * @param from
 * @param to
 * @param mode
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
const valueEndTime = (from, duration, mode = 'day') => {
    if (from && duration) {
        from = convertTime(from);
        Dg.ensurePositive(duration);
        return moment(from).add(duration, mode);
    } else {
        console.error("[V] Either 'from' or 'duration' must not be undefined.")
    }
};
const valueStartTime = (to, duration, mode = 'day') => {
    if (to && duration) {
        to = convertTime(to);
        Dg.ensurePositive(duration);
        return moment(to).subtract(duration, mode);
    } else {
        console.error("[V] Either 'to' or 'duration' must not be undefined.")
    }
};
export default {
    valueAppend,
    valueDuration,
    valueEndTime,
    valueStartTime,
    // 数学运算
    mathMultiplication,
    // 转换处理
    convertTime
}
