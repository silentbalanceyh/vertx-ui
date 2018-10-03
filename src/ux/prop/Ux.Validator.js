import U from 'underscore';
import UI from '../util/Ux.Html';
import Param from '../fun/Ux.Param';
import Prop from './Ux.Form';
import Field from './Ux.Field';
import Value from '../Ux.Value';
import Error from '../Ux.Error';
import Immutable from "immutable";

const _ready = (rule = {}) => {
    // 是否检查readonly和disabled
    let ready = true;
    if (rule.hasOwnProperty('status')) {
        // 如果readonly，disabled则不触发
        if (rule.status) {
            const id = rule.field;
            const status = UI.htmlReadOnly(id) || UI.htmlDisabled(id);
            ready = !status;
        }
    }
    return ready;
};

const _executeReady = (rule = {}, value, callback, fnCond = () => true) => {
    if (_ready(rule)) {
        // 处理required
        if (value && rule.config) {
            if (fnCond()) {
                callback();
            } else {
                callback(rule.message);
            }
        } else {
            callback();
        }
    } else {
        callback();
    }
};

const existing = (refereuce = {}) => (rule = {}, value, callback) => {
    Error.fxTerminal(!rule.config, 10022, rule.config);
    if (rule.config) {
        if (value) {
            // 有值才验证
            const parameters = Param.parseAjax(refereuce, rule.config.params);
            // 基本条件
            const field = rule.field;
            parameters[field] = value;
            const {$inited} = refereuce.props;
            if ($inited) {
                const {key: $key} = $inited;
                if ($key) {
                    // 更新Mode
                    const updateKey = `key,<>`;
                    parameters[updateKey] = $key;
                }
            }
            // existing 时，参数间关系默认为 AND
            if (Object.keys(parameters).length > 1) {
                const andKey = "";
                parameters[andKey] = true;
            }
            // 北二 existing 走 搜索流程, 所有参数都放到criteria 中
            parameters["criteria"] = Immutable.fromJS(parameters).toJS();
            // 远程调用
            Field.asyncTrue(rule.config, parameters, {
                // 存在即返回message
                success: () => callback(rule.message),
                failure: () => callback()
            });
        } else {
            callback();
        }
    }
};


const required = (reference = {}) => (rule = {}, value, callback) => {
    if (_ready(rule)) {
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

const after = (reference = {}) => (rule = {}, value, callback) => {
    _executeReady(rule, value, callback, () => {
        let to = Prop.formHit(reference, rule.config.to);
        const from = Value.convertTime(value);
        to = Value.convertTime(to);
        return from.isAfter(to);
    });
};
const before = (reference = {}) => (rule = {}, value, callback) => {
    _executeReady(rule, value, callback, () => {
        let to = Prop.formHit(reference, rule.config.to);
        const from = Value.convertTime(value);
        to = Value.convertTime(to);
        return to.isAfter(from);
    });
};
const less = (reference = {}) => (rule = {}, value, callback) => {
    _executeReady(rule, value, callback, () => {
        let to = Prop.formHit(reference, rule.config.to);
        return value < to;
    });
};
const lessOr = (reference = {}) => (rule = {}, value, callback) => {
    _executeReady(rule, value, callback, () => {
        let to = Prop.formHit(reference, rule.config.to);
        return value <= to;
    });
};
const greater = (reference = {}) => (rule = {}, value, callback) => {
    _executeReady(rule, value, callback, () => {
        let to = Prop.formHit(reference, rule.config.to);
        return value > to;
    });
};
const greaterOr = (reference = {}) => (rule = {}, value, callback) => {
    _executeReady(rule, value, callback, () => {
        let to = Prop.formHit(reference, rule.config.to);
        return value >= to;
    });
};
const equal = (reference = {}) => (rule = {}, value, callback) => {
    _executeReady(rule, value, callback, () => {
        let to = Prop.formHit(reference, rule.config.to);
        return String(value) === String(to) ||
            Number(value) === Number(to);
    });
};
const VERFIERS = {
    // 异步验证存在检查
    existing,
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
};
/**
 * 挂载Ant Design中的验证规则，访问`optionConfig`以及处理对应的`rules`节点
 * @method mountValidator
 * @param {React.PureComponent} reference React对应组件引用
 * @param item
 */
const mountValidator = (refereuce = {}, item = {}) => {
    if (item.optionConfig) {
        const rules = item.optionConfig.rules;
        // 触发条件设置，默认onBlur，符合大多数习惯
        if (!item.optionConfig.hasOwnProperty('validateTrigger')) {
            item.optionConfig.validateTrigger = "onBlur";
        }
        if (rules && Array.prototype.isPrototypeOf(rules)) {
            rules.forEach(rule => {
                if (rule.validator && !U.isFunction(rule.validator)) {
                    // 处理条件
                    const executeFun = VERFIERS[rule.validator];
                    // 10023
                    Error.fxTerminal(!U.isFunction(executeFun), 10023,
                        rule.validator, Object.keys(VERFIERS));
                    if (U.isFunction(executeFun)) {
                        const validatorFun = executeFun(refereuce);
                        // 10024
                        Error.fxTerminal(!U.isFunction(validatorFun), 10024,
                            U.isFunction(validatorFun));
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
