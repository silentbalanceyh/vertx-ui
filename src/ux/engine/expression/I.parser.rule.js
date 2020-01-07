const ruleRequired = (item = []) => {
    const config = {};
    config.required = true;
    config.message = item[0] ? item[0] : "";
    return config;
};
const ruleRequiredState = (status = true) => (item = {}) => {
    const config = {};
    config.validator = "required";
    config.message = item[0] ? item[0] : "";
    config.status = status;
    return config;
};
const RULER = {
    required: ruleRequired,
    requiredTrue: ruleRequiredState(true),
    requiredFalse: ruleRequiredState(false)
};
const parseRule = (rule = "") => {
    const rules = rule.replace(/ /g, '').split(',');
    const ruler = rules.shift();
    if (RULER[ruler]) {
        return RULER[ruler](rules);
    }
};
export default {
    parseRule,
}