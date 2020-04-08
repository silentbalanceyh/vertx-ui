import Parser from "./I.parser.up";
import Value from "../../element";

/**
 * ## 标准函数
 *
 * 窗口标准解析器，主要提供给 `Modal` 模态窗使用。
 *
 * @memberOf module:_aiExpr
 * @param {String} literal 输入表达式。
 * @returns {Object} 解析成标准的窗口对象。
 */
const aiExprWindow = (literal = "") => {
    const item = Parser.parseItem(literal, "window");
    if (item.hasOwnProperty('key')) {
        delete item['key'];
    }
    if (item.hasOwnProperty('visible')) item.visible = "true" === (item.visible);
    if (item.hasOwnProperty('maskClosable')) item.maskClosable = "true" === (item.maskClosable);
    if (item.hasOwnProperty('width')) item.width = Value.valueInt(item.width);
    return item;
};
/**
 * ## 标准函数
 *
 * 抽屉标准解析器，主要提供给 `Drawer` 抽屉组件使用。
 *
 * @memberOf module:_aiExpr
 * @param {String} drawer 输入表达式。
 * @returns {Object} 解析成标准的抽屉对象。
 */
const aiExprDrawer = (drawer = "") => {
    const item = Parser.parseItem(drawer, "drawer");
    if (item.hasOwnProperty('key')) {
        delete item['key'];
    }
    if (item.hasOwnProperty('visible')) item.visible = "true" === (item.visible);
    if (item.hasOwnProperty('maskClosable')) item.maskClosable = "true" === (item.maskClosable);
    if (item.hasOwnProperty('closable')) item.closable = "true" === (item.closable);
    return item;
};
/**
 * ## 标准函数
 *
 * 气泡浮游窗解析器，主要提供给 `Popover` 浮游窗口组件使用。
 *
 * @memberOf module:_aiExpr
 * @param {String} popover 输入表达式。
 * @returns {Object} 解析成标准的浮游窗口对象。
 */
const aiExprPopover = (popover = "") => {
    const item = Parser.parseItem(popover, "popover");
    if (item.hasOwnProperty('key')) {
        delete item['key'];
    }
    if (item.width) item.width = Value.valueInt(item.width);
    if (item.hasOwnProperty('visible')) item.visible = "true" === (item.visible);
    if (item.hasOwnProperty('closable')) item.closable = "true" === (item.closable);
    return item;
};
export default {
    aiExprWindow,
    aiExprDrawer,
    aiExprPopover
}