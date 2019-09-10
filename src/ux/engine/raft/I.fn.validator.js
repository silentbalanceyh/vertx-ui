import E from '../../error';
import U from 'underscore';
import VALIDATORS from '../validator';

/**
 * 挂载Ant Design中的验证规则，访问`optionConfig`以及处理对应的`rules`节点
 * @method mountValidator
 * @param reference React对应组件引用
 * @param item
 */
export default (reference = {}, item = {}) => {
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
                    const executeFun = VALIDATORS[rule.validator];
                    // 10023
                    E.fxTerminal(!U.isFunction(executeFun), 10023, rule.validator, Object.keys(VALIDATORS));
                    if (U.isFunction(executeFun)) {
                        // supplier 处理
                        const validatorFun = executeFun(reference);
                        // 10024
                        E.fxTerminal(!U.isFunction(validatorFun), 10024, U.isFunction(validatorFun));
                        if (U.isFunction(validatorFun)) {
                            rule.validator = validatorFun;
                        }
                    }
                }
            });
        }
    }
};