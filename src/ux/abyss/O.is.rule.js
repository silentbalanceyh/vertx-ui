import U from "underscore";

/**
 * ## 标准函数
 *
 * 检查 record 记录中的 field 字段对应的值是否满足 ( op, expected ）规则。
 *
 * @memberOf module:_is
 * @param {Object} record 检查记录
 * @param {String} field 检查字段
 * @param {String} op 检查操作
 * @param {any} expected 期望操作
 * @return {Boolean}
 */
const isRuleKv = (record = {}, field, op = "EQ", expected) => {
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
const _isObject = (input) => {
    if (input) {
        return !U.isArray(input) && U.isObject(input);
    } else return false;
}
/**
 * ## 标准函数
 *
 * ### 1. 基本介绍
 *
 * 检查记录 record 是否符合 ruleConfig 中的定义
 *
 * ### 2. 规则说明
 *
 * ruleConfig的数据结构如下：
 *
 * ```json
 * {
 *     "field1": "<RULE>",
 *     "field2": "<RULE>",
 *     "", true / false
 * }
 * ```
 *
 * 其中`<RULE>`的完整值列表如下：
 *
 * 1. `NIL`：该属性必须不为空
 * 2. `NUL`：该属性必须为空
 * 3. `GT,<N>`：该属性大于某个值
 * 4. `GE,<N>`：该属性大于等于某个值
 * 5. `LT,<N>`：该属性小于某个值
 * 6. `LE,<N>`：该属性小于等于某个值
 * 7. `EQ,<S>`：该属性等于某个值
 * 8. `NEQ,<S>`：该属性不等于某个值
 * 9. `ST,<S>`：以某个字符串开始
 * 10. `ET,<S>`：以某个字符串结束
 * 11. `CT,<S>`：包含了某个字符串
 *
 * @memberOf module:_is
 * @param {Object} record
 * @param {Object} ruleConfig
 * @return {Boolean}
 */
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
            return isRuleKv(record, key, op, expected);
        });
    return _isAndOr(matchArray, isAnd);
}
/**
 * ## 标准函数
 *
 * @memberOf module:_is
 * @param {Array} array
 * @param {Object} ruleConfig
 * @return {Boolean}
 */
const isRuleAll = (array = [], ruleConfig = {}) => {
    const matchArray = array
        .filter(_isObject)
        .map(item => isRule(item, ruleConfig));
    return _isAndOr(matchArray, true);
}
/**
 * ## 标准函数
 *
 * @memberOf module:_is
 * @param {Array} array
 * @param {Object} ruleConfig
 * @return {Boolean}
 */
const isRuleAny = (array = [], ruleConfig = {}) => {
    const matchArray = array
        .filter(_isObject)
        .map(item => isRule(item, ruleConfig));
    return _isAndOr(matchArray, false);
}
export default {
    isRule,
    isRuleAll,
    isRuleAny,
}