import Parser from "./I.parser.up";
import Apply from "./O.apply";
import mapIterator from './I.ai.fn.iterator';

/**
 * 顺序：key, text, connectId, type, icon
 */
const aiExprButton = (buttons = [], props = {}) => _aiExprButton(buttons, props);
// const aiExprDirect = (buttons = [], props = {}) => _aiExprButton(buttons, props, "direct");
const _aiExprButton = (buttons = [], props = {}, key = "button") =>
    mapIterator(buttons, (values = []) => Parser.parseItem(values, key))
        .map(Apply.applyConnect).map(item => Apply.applyLoading(item, props));
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
export default {
    aiExprButton,
    aiExprOp,
}