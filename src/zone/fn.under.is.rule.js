import __Is from './fn.under.is.decision';

const _isRuleKv = (record = {}, field, op = "EQ", expected) => {
    const actualValue = record[field];
    let checked;
    switch (op) {
        // 不为空，有值
        case "NIL":
            checked = !!actualValue;
            break;
        // 为空，无值
        case "NUL":
            checked = !actualValue;
            break;
        // 等于
        case "EQ":
            checked = (actualValue === expected);
            break;
        // 不等于
        case "NEQ":
            checked = (actualValue !== expected);
            break;
        // 大于
        case "GT":
            checked = (actualValue > expected);
            break;
        // 大于等于
        case "GE":
            checked = (actualValue >= expected);
            break;
        // 小于
        case "LT":
            checked = (actualValue < expected);
            break;
        // 小于等于
        case "LE":
            checked = (actualValue <= expected);
            break;
        // 以某个字符串开始
        case "ST":
            checked = (actualValue) ? actualValue.startsWith(expected) : false;
            break;
        // 以某个字符串结束
        case "ET":
            checked = (actualValue) ? actualValue.endsWith(expected) : false;
            break;
        // 包含了某个字符串
        case "CT":
            checked = (actualValue) ? 0 <= actualValue.indexOf(expected) : false;
            break;
        // 不包含某个字符串
        case "CF":
            checked = (actualValue) ? 0 > actualValue.indexOf(expected) : false;
            break;
        default:
            checked = false;
            break;
    }
    return checked;
}
const _isAndOr = (array = [], isAnd = false) => {
    const counter = array.filter(item => true === item).length;
    if (isAnd) {
        return counter === array.length;
    } else {
        return counter > 0;
    }
}
const isRule = (record = {}, ruleConfig = {}) => {
    // AND / OR
    const isAnd = (false !== ruleConfig[""]);
    // matchArray = [true, false, true, false, ...]
    const matchArray = Object.keys(ruleConfig)
        .filter(key => "" !== key)
        .filter(key => !!ruleConfig[key])
        .map(key => {
            // 处理规则
            const ruleItem = ruleConfig[key];
            /*
             * NIL, NUL
             */
            let op;
            let expected;
            if ("NIL" === ruleItem || "NUL" === ruleItem) {
                op = ruleItem;
            } else {
                if (0 <= ruleItem.indexOf(',')) {
                    op = ruleItem.split(',')[0];
                    expected = ruleItem.split(',')[1];
                } else {
                    op = "EQ";
                    expected = ruleItem;
                }
            }
            return _isRuleKv(record, key, op, expected);
        });
    return _isAndOr(matchArray, isAnd);
}
const isRuleAll = (array = [], ruleConfig = {}) => {
    const matchArray = array
        .filter(__Is.isObject)
        .map(item => isRule(item, ruleConfig));
    return _isAndOr(matchArray, true);
}
const isRuleAny = (array = [], ruleConfig = {}) => {
    const matchArray = array
        .filter(__Is.isObject)
        .map(item => isRule(item, ruleConfig));
    return _isAndOr(matchArray, false);
}
export default {
    isRule,
    isRuleAll,
    isRuleAny
}