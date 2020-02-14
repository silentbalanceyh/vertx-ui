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
const aiExprColumn = (columns = []) =>
    mapIterator(columns, (values = []) =>
            Apply.applyColumn(Parser.parseItem(values, "column")),
        aiMetaColumn)
        .map(column => Value.valueLadder(column)); /* 列的拉平处理 */

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