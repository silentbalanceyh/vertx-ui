import __Zn from './zero.module.dependency';
import __COND from './verify.__.fn.is.condition';

const _after = (value, to) => {
    const fromValue = __Zn.valueDatetime(value);
    to = __Zn.valueDatetime(to);
    return fromValue.isAfter(to);
};

const _before = (value, to) => {
    const fromValue = __Zn.valueDatetime(value);
    to = __Zn.valueDatetime(to);
    return to.isAfter(fromValue);
};
const _less = (value, to) => __Zn.valueFloat(value, 0.00) < __Zn.valueFloat(to, 0.00);
const _lessOr = (value, to) => __Zn.valueFloat(value, 0.00) <= __Zn.valueFloat(to, 0.00);
const _great = (value, to) => __Zn.valueFloat(value, 0.00) > __Zn.valueFloat(to, 0.00);
const _greatOr = (value, to) => __Zn.valueFloat(value, 0.00) >= __Zn.valueFloat(to, 0.00);
const _equal = (value, to) => value === to;
const _diff = (value, to) => value !== to;
const _maximum = (value, to) => value <= to;


const after = (reference = {}) => __COND.isReadyWithCond(reference, _after);

const before = (reference = {}) => __COND.isReadyWithCond(reference, _before);

const less = (reference = {}) => __COND.isReadyWithCond(reference, _less);

const lessOr = (reference = {}) => __COND.isReadyWithCond(reference, _lessOr);

const great = (reference = {}) => __COND.isReadyWithCond(reference, _great);

const greatOr = (reference = {}) => __COND.isReadyWithCond(reference, _greatOr);

const equal = (reference = {}) => __COND.isReadyWithCond(reference, _equal);

const diff = (reference = {}) => __COND.isReadyWithCond(reference, _diff);

const maximum = (reference = {}) => __COND.isMaximum(reference, _maximum);

const range = (isMin = true, isMax = true) => (rule = {}, value) => {
    const {config = {}, message} = rule;
    const number = Number(value);
    if (isNaN(number)) {
        return Promise.reject("VF: " + message);
        // ?allback("VF: " + message);
    } else {
        const {min, max} = config;
        let minOk = true;
        let maxOk = true;
        // isMin
        if (isMin) {
            if (isNaN(min)) {
                console.warn("CMin: ", message);
                minOk = false;
            } else {
                minOk = (min <= number);
            }
        }
        // isMax
        if (isMax) {
            if (isNaN(max)) {
                console.warn("CMax: ", message);
                maxOk = false;
            } else {
                maxOk = (number <= max);
            }
        }
        if (maxOk && minOk) {
            // ?allback()
            return Promise.resolve();
        } else {
            return Promise.reject(message);
            // ?allback("VF: " + message);
            // ?allback(message);
        }
    }
}
const min = () => range(true, false);
const max = () => range(false, true);
const currency = () => (rule = {}, value) => {
    const config = {min: 0}
    return range(true, false)({
        ...rule,
        config,
    }, value);
};

const required = (reference = {}) => (rule = {}, value) => {
    if (__COND.isReady(rule, reference)) {
        if (__Zn.isArray(value)) {
            /* Array 类型的，长度必须 > 0 */
            if (0 < value.length) {
                return Promise.resolve();
                // ?allback();
            } else {
                return Promise.reject(rule.message);
                // ?allback(rule.message);
            }
        } else if (__Zn.isObject(value)) {
            /* Object 类型，不可以为 {} */
            if (__Zn.isNotEmpty(value)) {
                return Promise.resolve();
                // ?allback();
            } else {
                return Promise.reject(rule.message);
                // ?allback(rule.message);
            }
        } else {
            // 处理required
            if (value) {
                return Promise.resolve();
                // ?allback();
            } else {
                return Promise.reject(rule.message);
                // ?allback(rule.message);
            }
        }
    } else {
        return Promise.resolve();
        // ?allback();
    }
};
/*
 * 异步验证执行大规模改动，主要是返回值进行了调整
 * 原来的写法：
 * - 正确：callback()
 * - 错误：callback(message)
 *
 * 新的写法：
 * - 正确：Promise.resolve()
 * - 错误：Promise.reject(message)
 */
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    // 必填项检查，和Ant Design不同是这里的检查包括一些空值
    required,
    // 时间在目标字段之后
    after,
    // 时间在目标字段之前
    before,
    // < 小于目标字段
    less,
    // <= 小于等于目标字段
    lessOr,
    // > 大于目标字段
    great,
    // >= 大于等于目标字段
    greatOr,
    // == 等于
    equal,
    // 不等检查
    diff,
    // 相同检查
    same: equal,
    // 浮点类型字段整数位最大长度
    maximum,
    // 数值
    min,
    max,
    range,
    currency,
};