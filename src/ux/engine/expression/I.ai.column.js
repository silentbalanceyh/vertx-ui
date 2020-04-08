import Parser from "./I.parser.up";
import Value from "../../element";
import Apply from "./O.apply";
import mapIterator from './I.ai.fn.iterator';
import U from "underscore";

const aiMetaColumn = (item = {}) => {
    if (item.metadata) {
        const {metadata, ...rest} = item;
        const basic = Parser.parseItem(metadata, "column");
        const options = Value.valueLadder(rest);
        Object.assign(basic, options);
        Apply.applyColumn(basic);
        item = basic;
    }
    return item;
};
/**
 * ## 标准函数
 *
 * 列专用解析器，表格中的 columns 配置解析
 *
 * @memberOf module:_aiExpr
 * @param {Array} columns 针对字符串数组和对象数组的合并解析流程。
 * @returns {Array} 解析成标准的 column 数组格式。
 */
const aiExprColumn = (columns = []) =>
    mapIterator(columns, (values = []) =>
            Apply.applyColumn(Parser.parseItem(values, "column")),
        aiMetaColumn)
        .map(column => Value.valueLadder(column)); /* 列的拉平处理 */
/**
 * ## 标准函数
 *
 * 图标解析专用，解析图标中的风格数据，解析多个图标。
 *
 * @memberOf module:_aiExpr
 * @param {Array} icons 图标解析。
 * @returns {Array} 解析成标准的 icons 数组格式。
 */
const aiExprIcon = (icons) => {
    const fnNorm = (item = {}) => {
        if (item.iconStyle && item.iconStyle.fontSize) {
            const fontSize = Value.valueInt(item.iconStyle.fontSize, -1);
            if (-1 < fontSize) {
                item.iconStyle.fontSize = fontSize;
            } else {
                item.iconStyle.fontSize = 12;
            }
        }
        return item;
    };
    if ("string" === typeof icons) {
        return fnNorm(Parser.parseItem(icons, "icon"));
    } else if (U.isArray(icons)) {
        return mapIterator(icons, (values = []) => fnNorm(Parser.parseItem(values, "icon")));
    }
};
export default {
    aiExprColumn,
    aiExprIcon
}