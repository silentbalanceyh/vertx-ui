import Parser from "./I.parser.up";
import Apply from "./O.apply";
import mapIterator from './I.ai.fn.iterator';

/**
 * ## 标准函数
 *
 * 按钮标准解析，解析顺序：`key, text, connectId, type, icon`
 *
 * @memberOf module:_aiExpr
 * @param {String|Object} literal 解析按钮。
 * @param {Props} props React属性信息。
 * @returns {Object} 解析的标准按钮配置。
 */
const aiExprButton = (literal, props = {}) => {
    let button = Parser.parseItem(literal, "button");
    button = Apply.applyConnect(button);
    button = Apply.applyLoading(button, props);
    return button;
};
/**
 * ## 标准函数
 *
 * 按钮组标准解析，解析顺序：`key, text, connectId, type, icon`
 *
 * @memberOf module:_aiExpr
 * @param {Array} buttons 每个按钮会使用`literal`解析。
 * @param {Props} props React属性信息。
 * @returns {Array} 解析的标准按钮配置。
 */
const aiExprButtons = (buttons = [], props = {}) => _aiExprButton(buttons, props);
// const aiExprDirect = (buttons = [], props = {}) => _aiExprButton(buttons, props, "direct");
const _aiExprButton = (buttons = [], props = {}, key = "button") =>
    mapIterator(buttons, (values = []) => Parser.parseItem(values, key))
        .map(Apply.applyConnect).map(item => Apply.applyLoading(item, props));
/**
 * ## 标准函数
 *
 * 针对按钮的标准解析器。
 *
 * @memberOf module:_aiExpr
 * @param {String|Object} button 解析按钮。
 * @returns {Object} 按钮标准对象配置。
 */
const aiExprOp = (button = "") => {
    let parsed;
    if ("string" === typeof button) {
        const splitted = button.split(',');
        if (1 === splitted.length) {
            const item = {};
            item.id = button;
            item.key = button;
            item.text = "";
            parsed = item;
        } else {
            parsed = Parser.parseItem(button, "op");
        }
    } else {
        parsed = button;
    }
    if (parsed.key) {
        if (!parsed.id) parsed.id = parsed.key;
    }
    return parsed;
};
/**
 * ## 标准函数
 *
 * 针对 popover 的按钮专用解析器。
 *
 * @memberOf module:_aiExpr
 * @param {String|Object} popover 需要解析的 action 操作专用配置。
 * @returns {Object} 解析成标准的 action。
 */
const aiExprAction = (popover = "") => Parser.parseItem(popover, "action");

export default {
    aiExprButtons,
    aiExprButton,
    aiExprOp,
    aiExprAction,   // Web 组件中需要使用，不可缺
}