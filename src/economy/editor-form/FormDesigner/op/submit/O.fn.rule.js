const dataRuleTo = (rules = [], ruleData = {}, key = "") => {
    if (ruleData[`rule${key}`]) {
        if (ruleData[`rule${key}Message`] && undefined !== ruleData[`rule${key}To`]) {
            const rule = {};
            rule.validator = key.toLocaleLowerCase();
            rule.message = ruleData[`rule${key}Message`];
            rule.config = {to: ruleData[`rule${key}To`]};
            rules.push(rule);
        }
    }
}

export default (normalized = {}, params = {}) => {
    const rules = [];
    /*
     * 必填规则
     */
    if (params.required && params.requiredMessage) {
        const rule = {};
        rule.required = true;
        rule.message = params.requiredMessage;
        rules.push(rule);
    }
    /*
     * rule 专用处理
     */
    const ruleData = {};
    Object.keys(params).filter(rule => rule.startsWith("rule"))
        .forEach(ruleKey => ruleData[ruleKey] = params[ruleKey]);
    /*
    * min，max, len
    * 最小值，最大值，长度
    */
    if (ruleData.ruleMin) {
        if (ruleData.ruleMinMessage && undefined !== ruleData.ruleMinValid) {
            const rule = {};
            rule.min = ruleData.ruleMinValid;
            rule.message = ruleData.ruleMinMessage;
            rules.push(rule);
        }
    }
    if (ruleData.ruleMax) {
        if (ruleData.ruleMaxMessage && undefined !== ruleData.ruleMaxValid) {
            const rule = {};
            rule.max = ruleData.ruleMaxValid;
            rule.message = ruleData.ruleMaxMessage;
            rules.push(rule);
        }
    }
    if (ruleData.ruleLen) {
        if (ruleData.ruleLenMessage && undefined !== ruleData.ruleLenValid) {
            const rule = {};
            rule.len = ruleData.ruleLenValid;
            rule.message = ruleData.ruleLenMessage;
            rules.push(rule);
        }
    }
    if (ruleData.ruleReg) {
        if (ruleData.ruleRegMessage && undefined !== ruleData.ruleRegValid) {
            const rule = {};
            rule.pattern = ruleData.ruleRegValid;
            rule.message = ruleData.ruleRegMessage;
            rules.push(rule);
        }
    }
    if (ruleData.ruleEnum) {
        if (ruleData.ruleEnumMessage && ruleData.ruleEnumValid) {
            const rule = {};
            rule.enum = ruleData.ruleEnumValid;
            rule.message = ruleData.ruleEnumMessage;
            rules.push(rule);
        }
    }
    /*
     *  Diff / Equal 两个基本规则
     * */
    dataRuleTo(rules, ruleData, 'Equal');
    dataRuleTo(rules, ruleData, 'Diff');
    /*
     *  Before / After 两个时间基本规则
     */
    dataRuleTo(rules, ruleData, "Before");
    dataRuleTo(rules, ruleData, "After")
    /*
     * 大于 / 小于
     */
    if (ruleData.ruleLess) {
        if (ruleData.ruleLessMessage && undefined !== ruleData.ruleLessTo) {
            const rule = {};
            if (ruleData.ruleLessMode) {
                /* 包含边界 */
                rule.validator = "lessOr";
            } else {
                /* 不包含边界 */
                rule.validator = "less";
            }
            rule.message = ruleData.ruleLessMessage;
            rule.config = {to: ruleData.ruleLessTo};
            rules.push(rule);
        }
    }
    if (ruleData.ruleGreat) {
        if (ruleData.ruleGreatMessage && undefined !== ruleData.ruleGreatTo) {
            const rule = {};
            if (ruleData.ruleGreatMode) {
                /* 包含边界 */
                rule.validator = "greatOr";
            } else {
                /* 不包含边界 */
                rule.validator = "great";
            }
            rule.message = ruleData.ruleGreatMessage;
            rule.config = {to: ruleData.ruleGreatTo};
            rules.push(rule);
        }
    }
    if (0 < rules.length) {
        /* 规则处理 */
        normalized.optionConfig.rules = rules;
    }
}