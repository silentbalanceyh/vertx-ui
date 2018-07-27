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
    const styleStr = values[2];
    const styleArr = styleStr.split(':');
    const style = {};
    style.fontSize = `${styleArr[0]}px`;
    style.color = `${styleArr[1]}`;
    item[FLAG[flag[2]]] = style;
    return item;
};
const aiExprColumn = (columns = []) => {
    /**
     * 默认：
     * 0 - key
     * 1 - title
     */
    const result = [];
    columns.forEach(item => {
        if ("string" === typeof item) {
            const column = {};
            const values = item.split(',');
            column.dataIndex = values[0];
            column.title = values[1];
            result.push(column);
        } else if ("object" === typeof item) {
            result.push(item);
        }
    });
    return result;
};
export default {
    aiExpr,
    aiExprColumn
}