import moment from "moment";
import Abs from '../abyss';

/**
 * ## 时间转换器
 *
 * 定义时间格式转换类，内部调用 `moment` 库中的日期时间格式，主要用于转换输入对象
 *
 * * input：输入的对象相关信息。
 * * config：将要转换的时间配置信息。
 *
 * config 的结构如下：
 *
 * ```json
 * {
 *      "format": "时间专用 Pattern"
 * }
 * ```
 *
 * 使用方式的代码如下：
 *
 * ```js
 * const fromIn = { from:"2020-01-01", to:"2020-01-20" };
 * const fromValue = Ux.Moment.from(fromIn,{
 *     format: "YYYY-MM-DD"
 * });
 *
 * const toIn = {
 *     from: Moment("2020-01-01", "YYYY-MM-DD"),
 *     to: Moment("2020-01-20", "YYYY-MM-DD")
 * }
 * const toValue = Ux.Moment.to(toIn,{
 *     format: "YYYY-MM-DD"
 * });
 * ```
 *
 * @class Moment
 *
 */
class Moment {
    /**
     * ## 标准函数
     *
     * 将传入的`fields`对应属性从 `moment` 类型转换成字符串类型，用于提交到后端之前格式转换。
     *
     * @param input 输入的对象相关信息。
     * @param config 将要转换的时间配置信息。
     * @param {String[]} fields 需要转换的字段信息
     * @return {any} 返回转换过后的数据信息
     */
    static to(input, config, ...fields) {
        const $data = Abs.clone(input);
        const format = config.format ? config.format : "YYYY-MM-DDTHH:mm:ss";
        fields.filter(field => !!input[field])
            .filter(field => moment.isMoment(input[field]))
            .forEach(field => $data[field] = input[field].format(format));
        return $data;
    };

    /**
     * ## 标准函数
     *
     * 将传入的`fields`对应属性从字符串类型转换成合法的 `moment` 类型，主要用于从后端读取数据在 Web界面呈现时专用。
     *
     * @param input 输入的对象相关信息。
     * @param config 将要转换的时间配置信息。
     * @param {String[]} fields 需要转换的字段信息
     * @return {any} 返回转换过后的数据信息
     */
    static from(input, config, ...fields) {
        const $data = Abs.clone(input);
        const format = config.format ? config.format : "YYYY-MM-DDTHH:mm:ss";
        fields.filter(field => !!input[field])
            .filter(field => "string" === typeof input[field])
            .forEach(field => $data[field] = moment(input[field], format));
        return $data;
    }
}


/**
 * ## 集成函数
 *
 * 内部直接调用`JSON.parse`解析，将字符串转换成对象，如果转换出错则直接返回`null`值。
 *
 * @memberOf module:_to
 * @param {any} input 传入的被转换对象。
 * @return {null|any} 转换出来的Json对象。
 */
const toJson = (input) => {
    if ("string" === typeof input) {
        try {
            return JSON.parse(input);
        } catch (e) {
            return null;
        }
    } else return input;
};
/**
 * ## 标准函数
 *
 * 设置 moment 对象中的固定时间信息（设置时、分、秒），根据 `timeStr` 进行日期格式解析。
 *
 * @memberOf module:_to
 * @param {Moment} momentValue 被转换的合法的 moment 对象。
 * @param {String} timeStr 传入的合法日期时间格式。
 * @return {Moment} 返回一个合法的 moment 对象。
 */
const toTime = (momentValue, timeStr) => {
    if (moment.isMoment(momentValue) && "string" === typeof timeStr) {
        /*
         * Time
         */
        const defaultTime = moment(timeStr, "HH:mm:ss");
        if (defaultTime.isValid()) {
            /*
             * Copy hour, min, second
             */
            momentValue.hour(defaultTime.hour());
            momentValue.minute(defaultTime.minute());
            momentValue.second(defaultTime.second());
            return momentValue;
        } else return momentValue;
    } else return momentValue;
};
/**
 * ## 标准函数
 *
 * @param {any} input
 * @return {Array}
 */
const toArray = (input) => {
    let resultArr = [];
    if (Set.prototype.isPrototypeOf(input)) {
        resultArr = Array.from(input);
    } else if (Abs.isArray(input)) {
        resultArr = Abs.clone(input);
    } else {
        resultArr = [input];
    }
    return resultArr;
}
export default {
    toArray,
    toJson,
    toTime,
    Moment: (input = {}, config = {}) => ({
        to: (...fields) => Moment.to.apply(null, [input, config].concat(fields)),
        from: (...fields) => Moment.from.apply(null, [input, config].concat(fields))
    }),
}