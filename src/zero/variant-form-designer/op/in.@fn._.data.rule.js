import __Zn from '../zero.uca.dependency';

export default (normalized = {}, data = {}) => {
    const rules = __Zn.valuePath(data, "optionConfig.rules");
    if (__Zn.isArray(rules)) {
        rules.forEach(rule => {
            /* 必填规则 */
            if (rule.required) {
                normalized.required = rule.required;
                normalized.requiredMessage = rule.message;
            }
            /* AD: min 规则 */
            if (rule.hasOwnProperty('min')) {
                normalized.ruleMin = true;
                normalized.ruleMinValid = rule.min;
                normalized.ruleMinMessage = rule.message;
            }
            /* AD: max 规则 */
            if (rule.hasOwnProperty("max")) {
                normalized.ruleMax = true;
                normalized.ruleMaxValid = rule.max;
                normalized.ruleMaxMessage = rule.message;
            }
            /* AD: len 规则 */
            if (rule.hasOwnProperty("len")) {
                normalized.ruleLen = true;
                normalized.ruleLenValid = rule.len;
                normalized.ruleLenMessage = rule.message;
            }
            /* AD: reg 规则 */
            if (rule.hasOwnProperty("pattern")) {
                normalized.ruleReg = true;
                normalized.ruleRegValid = rule.pattern;
                normalized.ruleRegMessage = rule.message;
            }
            /* AD: enum 规则 */
            if (rule.hasOwnProperty('enum')) {
                normalized.ruleEnum = true;
                normalized.ruleEnumValid = rule.enum;
                normalized.ruleEnumMessage = rule.message;
            }
            /* 自定义规则 */
            if (rule.hasOwnProperty("validator")) {
                const validator = rule.validator;
                const to = rule.config ? rule.config.to : null;
                /* less, lessOr, great, greatOr */
                if ("less" === validator) {
                    normalized.ruleLess = true;
                    normalized.ruleLessMode = "less";
                    normalized.ruleLessMessage = rule.message;
                    normalized.ruleLessTo = to;
                } else if ("lessOr" === validator) {
                    normalized.ruleLess = true;
                    normalized.ruleLessMode = "lessOr";
                    normalized.ruleLessMessage = rule.message;
                    normalized.ruleLessTo = to;
                } else if ("great" === validator) {
                    normalized.ruleGreat = true;
                    normalized.ruleGreatMode = "great";
                    normalized.ruleGreatMessage = rule.message;
                    normalized.ruleGreatTo = to;
                } else if ("greatOr" === validator) {
                    normalized.ruleGreat = true;
                    normalized.ruleGreatMode = "greatOr";
                    normalized.ruleGreatMessage = rule.message;
                    normalized.ruleGreatTo = to;
                }
                /* after, before, equal, diff */
                else if ("after" === validator) {
                    normalized.ruleAfter = true;
                    normalized.ruleAfterMessage = rule.message;
                    normalized.ruleAfterTo = to;
                } else if ("before" === validator) {
                    normalized.ruleBefore = true;
                    normalized.ruleBeforeMessage = rule.message;
                    normalized.ruleBeforeTo = to;
                } else if ("equal" === validator) {
                    normalized.ruleEqual = true;
                    normalized.ruleEqualMessage = rule.message;
                    normalized.ruleEqualTo = to;
                } else if ("diff" === validator) {
                    normalized.ruleDiff = true;
                    normalized.ruleDiffMessage = rule.message;
                    normalized.ruleDiffTo = to;
                }
            }
        })
    }
}