import Op from '../Ux.Op';

/**
 * 特殊格式解析
 * @param literal
 */
const FLAG = {
    n: "name",
    x: "text",
    l: "label",
    d: "display",
    i: "icon",
    t: "title",
    s: "style"
};
const _style = (literal = "") => {
    const styleArr = literal.split(':');
    const style = {};
    style.fontSize = `${styleArr[0]}px`;
    style.color = `${styleArr[1]}`;
    return style;
};
const _iterator = (array = [], callback, objectCallback = data => data) => {
    const items = [];
    array.forEach(each => {
        if ("string" === typeof each) {
            each = each.replace(/ /g, '');
            const item = callback(each.split(','));
            items.push(item);
        } else {
            items.push(objectCallback(each));
        }
    });
    return items;
};
const aiExpr = (literal = "", flag = ["n", "i", "s"]) => {
    /**
     * 默认：
     * 0 - name / text / title / label / display
     * 1 - icon
     * 2 - style ( color, fontSize )
     * 3 -
     */
    const values = literal.split(',');
    const item = {};
    item[FLAG[flag[0]]] = values[0];
    item[FLAG[flag[1]]] = values[1];
    // style专用解析
    item[FLAG[flag[2]]] = _style(values[2]);
    return item;
};
/**
 * 默认：
 * 0 - key
 * 1 - title
 */
const aiExprColumn = (columns = []) => _iterator(columns, (values = []) => {
    const column = {};
    column.dataIndex = values[0];
    column.title = values[1];
    return column;
});
/**
 * 默认：
 * 0 - key / value
 * 1 - label
 * 2 - style
 */
const aiExprOption = (options = []) => _iterator(options, (values = []) => {
    const item = {};
    item.key = values[0];
    item.value = values[0];
    item.label = values[1];
    item.style = _style(values[2]);
    return item;
});
/**
 * 默认：
 * 0 - key / value
 * 1 - label
 * 2 - style
 */
const aiExprButton = (buttons = []) => _iterator(buttons, (values = []) => {
    const item = {};
    item.key = values[0];
    item.text = values[1];
    if (values[2]) {
        item.onClick = () => Op.connectId(values[2]);
    }
    item.type = values[3] ? values[3] : "default";
    if (values[4]) item.icon = values[4];
    return item;
}, item => {
    if (item.connectId) {
        const connectId = item.connectId;
        item.onClick = () => Op.connectId(connectId);
        delete item.connectId;
    }
    return item;
});
export default {
    aiExpr,
    aiExprColumn,
    aiExprOption,
    aiExprButton
}