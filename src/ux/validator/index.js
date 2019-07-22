import U from "underscore";
import Error from "../Ux.Error";
import Ready from './Ux.Ready';
import Rule from './Ux.Rule';
import Async from './Ux.Async';

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
const VERFIERS = {
    // 异步验证存在检查
    ...Async,
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
/**
 * 挂载Ant Design中的验证规则，访问`optionConfig`以及处理对应的`rules`节点
 * @method mountValidator
 * @param reference React对应组件引用
 * @param item
 */
const mountValidator = (reference = {}, item = {}) => {
    if (item.optionConfig) {
        const rules = item.optionConfig.rules;
        // 触发条件设置，默认onBlur，符合大多数习惯
        if (!item.optionConfig.hasOwnProperty("validateTrigger")) {
            item.optionConfig.validateTrigger = "onBlur";
        }
        if (rules && Array.prototype.isPrototypeOf(rules)) {
            rules.forEach(rule => {
                if (rule.validator && !U.isFunction(rule.validator)) {
                    // 处理条件
                    const executeFun = VERFIERS[rule.validator];
                    // 10023
                    Error.fxTerminal(!U.isFunction(executeFun), 10023, rule.validator, Object.keys(VERFIERS));
                    if (U.isFunction(executeFun)) {
                        // supplier 处理
                        const validatorFun = executeFun(reference);
                        // 10024
                        Error.fxTerminal(!U.isFunction(validatorFun), 10024, U.isFunction(validatorFun));
                        if (U.isFunction(validatorFun)) {
                            rule.validator = validatorFun;
                        }
                    }
                }
            });
        }
    }
};
/**
 * @class Validator
 * @description Ant Design验证规则横切注入专用
 */
export default {
    mountValidator
};
