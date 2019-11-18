import Parser from "./I.parser.up";
import Value from "../../element";

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