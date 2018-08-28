import moment from "moment";
import E from "../Ux.Error";

/**
 * 直接转换数据成Moment对象，时间处理
 * @method convertTime
 * @param value 输入数据
 * @param format 格式
 * @return {*}
 */
const convertTime = (value, format = moment.ISO_8601) => {
    if (value) {
        if (!moment.isMoment(value)) {
            value = moment(value, format);
            E.fxTerminal(!moment.isMoment(value), 10028, value);
        }
        return value;
    } else {
        E.fxTerminal(true, 10028, value);
    }
};
const convertTimes = (data = {}, ...fields) => {
    fields.forEach(field => {
        if (data[field]) data[field] = convertTime(data[field]);
    })
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
        E.fxTerminal(true, 10030, from, to, "NoNeed");
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
        E.fxTerminal(duration < 0, 10068, duration);
        return moment(from).add(duration, mode);
    } else {
        E.fxTerminal(true, 10030, from, "NoNeed", duration);
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
        E.fxTerminal(duration < 0, 10068, duration);
        return moment(to).subtract(duration, mode);
    } else {
        E.fxTerminal(true, 10030, "NoNeed", to, duration);
    }
};
export default {
    valueStartTime,
    valueDuration,
    valueEndTime,
    convertTimes,
    convertTime
}