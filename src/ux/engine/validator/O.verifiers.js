import Ready from './I.ready';
import Rule from './I.rule';

const required = (reference = {}) => (rule = {}, value, callback) => {
    if (Ready.isReady(rule, reference)) {
        // 处理required
        if (value) {
            callback();
        } else {
            callback(rule.message);
        }
    } else {
        callback();
    }
};

const after = (reference = {}) => Ready.isReadyWithCond(reference, Rule.after);

const before = (reference = {}) => Ready.isReadyWithCond(reference, Rule.before);

const less = (reference = {}) => Ready.isReadyWithCond(reference, Rule.less);

const lessOr = (reference = {}) => Ready.isReadyWithCond(reference, Rule.lessOr);

const greater = (reference = {}) => Ready.isReadyWithCond(reference, Rule.greater);

const greaterOr = (reference = {}) => Ready.isReadyWithCond(reference, Rule.greaterOr);

const equal = (reference = {}) => Ready.isReadyWithCond(reference, Rule.equal);

const diff = (reference = {}) => Ready.isReadyWithCond(reference, Rule.diff);
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
    greater,
    // >= 大于等于目标字段
    greaterOr,
    // == 等于
    equal,
    // 不等检查
    diff,
    // 相同检查
    same: equal,
};
