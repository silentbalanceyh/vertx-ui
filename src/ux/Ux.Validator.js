import U from 'underscore'
import UI from './Ux.Html'
import Param from './Ux.Param';
import Prop from './Ux.Prop';
import Field from './Ux.Field';
import Value from './Ux.Value';

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
    if (rule.config) {
        if (value) {
            // 有值才验证
            const parameters = Param.parseAjax(refereuce, rule.config.params);
            // 基本条件
            const field = rule.field;
            parameters[field] = value;
            const {$key} = refereuce.props;
            if ($key) {
                // 更新Mode
                const updateKey = `key,<>`;
                parameters[updateKey] = $key;
            }
            // 远程调用
            Field.asyncTrue(rule.config, parameters, {
                // 存在即返回message
                success: () => callback(rule.message),
                failure: () => callback()
            });
        } else {
            callback();
        }
    } else {
        console.error("[V] Validator config node missing.");
    }
};


const required = (reference = {}) => (rule = {}, value, callback) => {
    _executeReady(rule, value, callback, () => !!value);
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
            Number(value) === Number(to)
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
                    if (U.isFunction(executeFun)) {
                        const validatorFun = executeFun(refereuce);
                        if (U.isFunction(validatorFun)) {
                            rule.validator = validatorFun;
                        } else {
                            console.info("[Ux] Validator Fun Error!");
                        }
                    } else {
                        console.info("[Ux] Execute Fun Error!");
                    }
                }
            })
        }
    }
};
/**
 * @class Validator
 * @description Ant Design验证规则横切注入专用
 */
export default {
    mountValidator
}
