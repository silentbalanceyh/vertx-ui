import moment from "moment";
import E from "../error";

/**
 * ## 标准函数
 *
 * 时间转换标准函数，将字符串格式的对象转换成合法 Moment 对象，返回失败则报错。
 *
 * @memberOf module:_value
 * @param {String} value 被转换的字符串。
 * @param {String} format Moment可解析的格式信息，默认ISO。
 * @return {Moment} 返回 Moment 对象。
 */
const valueTime = (value, format = moment.ISO_8601) => {
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
/**
 * ## 标准函数
 *
 * 时间转换专用函数，将对象中的 Object 中所有 `fields` 字段转换成时间格式。
 *
 * > 这个函数只支持 ISO 格式。
 *
 * @memberOf module:_value
 * @param {Object} data 被转换的对象数据。
 * @param {String[]} fields 被转换对象的字段数组信息。
 */
const valueTimes = (data = {}, ...fields) => {
    fields.forEach(field => {
        if (data[field]) data[field] = valueTime(data[field]);
    });
};
/**
 * ## 标准函数
 *
 * 根据from和to计算中间的duration差值。
 *
 * * years - y
 * * monthds -M
 * * weeks -w
 * * days - d
 * * hours - h
 * * minutes - m
 * * seconds - s
 * * milliseconds - ms
 *
 * @memberOf module:_value
 * @param {String|Moment} from 开始时间
 * @param {String|Moment} to 结束时间
 * @param {String} mode 计算模式
 * @return {number} 返回最终的计算数值
 */
const valueDuration = (from, to, mode = 'day') => {
    if (from && to) {
        from = valueTime(from);
        to = valueTime(to);
        return moment(to).diff(from, mode);
    } else {
        E.fxTerminal(true, 10030, from, to, "NoNeed");
    }
};
/**
 * ## 标准函数
 *
 * 根据开始时间、间隔、模式计算结束时间
 *
 * @memberOf module:_value
 * @param {String|Moment} from 开始时间
 * @param {Number} duration 间隔时间
 * @param {String} mode 计算模式
 * @return {Moment} 返回结束时间
 */
const valueEndTime = (from, duration, mode = 'day') => {
    if (from && duration) {
        from = valueTime(from);
        E.fxTerminal(duration < 0, 10068, duration);
        return moment(from).add(duration, mode);
    } else {
        E.fxTerminal(true, 10030, from, "NoNeed", duration);
    }
};
/**
 * ## 标准函数
 *
 * 根据结束时间、间隔、模式计算开始时间
 *
 * @memberOf module:_value
 * @param {String|Moment} to 结束时间
 * @param {Number} duration 间隔时间
 * @param {String} mode 计算模式
 * @return {Moment} 返回开始时间
 */
const valueStartTime = (to, duration, mode = 'day') => {
    if (to && duration) {
        to = valueTime(to);
        E.fxTerminal(duration < 0, 10068, duration);
        return moment(to).subtract(duration, mode);
    } else {
        E.fxTerminal(true, 10030, "NoNeed", to, duration);
    }
};
/**
 * ## 标准函数
 *
 * 返回当前时间，直接得到 Moment 对象。
 *
 * @memberOf module:_value
 * @param {String} pattern 可支持的时间格式。
 * @return {any} 返回合法的 Moment 对象。
 */
const valueNow = (pattern) => {
    return undefined === pattern ? moment() :
        (null === pattern ? moment().toISOString() : moment().format(pattern));
};
export default {
    valueStartTime,
    valueDuration,
    valueEndTime,
    valueNow,
    valueTimes,
    valueTime
};