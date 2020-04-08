import mapIterator from "./I.ai.fn.iterator";
import Parser from "./I.parser.up";
import Apply from "./O.apply";

/**
 * ## 标准函数
 *
 * 选择框专用的 options 解析器
 *
 * @memberOf module:_aiExpr
 * @param {Array} options 针对字符串数组和对象数组的合并解析流程。
 * @returns {Array} 解析成标准的 option 数组格式。
 */
const aiExprOption = (options = []) =>
    mapIterator(options,
        (values = []) => Parser.parseItem(values, "option"),
        aiMetaOption)
        .map(Apply.applyValue);

const aiMetaOption = (item = {}) => {
    if (item.metadata) {
        let each = Parser.parseItem(item.metadata, "option");
        if (item.items) each.items = aiExprOption(item.items);
        if (item.children) each.children = aiExprOption(item.children);
        item = each;
    }
    return item;
};

export default {
    aiExprOption,
}