import __VALIDATOR_COMMON from './verify.__.fn._.validator.common';
import __VALIDATOR_ASYNC from './verify.__.fn._.validator.async';
import __Zn from './zero.module.dependency';

const __V_VALIDATOR = {
    ...__VALIDATOR_COMMON,
    ...__VALIDATOR_ASYNC
}

const valveValidator = (reference, rules, config = {}) => {
    let parsed = [];
    if (rules && __Zn.isArray(rules)) {
        parsed = __Zn.applyRules(rules);
    }
    parsed.forEach(rule => {
        if (rule.validator && !__Zn.isFunction(rule.validator)) {
            // 合并处理（可覆盖）
            const inputValidator = __Zn.ambAnnex(reference, "$validator");
            // 旧代码 Abs.pass(reference, '$validator');
            const validators = __Zn.clone(__V_VALIDATOR);
            Object.assign(validators, inputValidator);

            // 处理条件
            const executeFun = validators[rule.validator];
            // 10023
            __Zn.fxTerminal(!__Zn.isFunction(executeFun), 10023, rule.validator, Object.keys(validators));
            if (__Zn.isFunction(executeFun)) {
                // supplier 处理
                const validatorFun = executeFun(reference, config);
                // 10024
                __Zn.fxTerminal(!__Zn.isFunction(validatorFun), 10024, __Zn.isFunction(validatorFun));
                if (__Zn.isFunction(validatorFun)) {
                    rule.validator = validatorFun;
                }
            }
        }
    });
    return parsed;
}

export default {
    valveValidator
}
