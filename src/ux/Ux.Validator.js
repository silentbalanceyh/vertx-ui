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
                success : () => callback(rule.message),
                failure : () => callback()
            });
        } else {
            callback();
        }
    } else {
        console.error("[V] Validator config node missing.");
    }
};


const required = (reference = {}) => (rule = {}, value, callback) => {
    // 是否检查状态
    if (_ready(rule)) {
        // 处理required
        if (value) {
            callback();
        } else {
            // 消息处理message
            callback(rule.message);
        }
    } else {
        callback();
    }
};

const after = (reference = {}) => (rule = {}, value, callback) => {
    // 是否检查状态
    if (_ready(rule)) {
        // 处理required
        if (value && rule.config) {
            let to = Prop.formHit(reference, rule.config.to);
            const from = Value.convertTime(value);
            to = Value.convertTime(to);
            if (from.isAfter(to)) {
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
const VERFIERS = {
    existing,
    required,
    after
};

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
export default {
    mountValidator
}
