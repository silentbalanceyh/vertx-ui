import Abs from "../../abyss";
import Col from './O.raft.column';
import Rdr from './O.raft.render';

const raftItem = (item = {}, values = {}, config = {}) => {
    const {
        rowStyle = {},
        entity,
        spanAdjust,
    } = config;
    // 初始化optionConfig
    if (!item.optionConfig) {
        item.optionConfig = {};
    }
    // rowStyle 设置
    if (item.optionItem && rowStyle && 0 < Object.keys(rowStyle).length) {
        if (item.optionItem.style) {
            // 直接合并
            // eslint-disable-next-line
            for (const key in rowStyle) {
                if (rowStyle.hasOwnProperty(key)) {
                    item.optionItem.style[key] = rowStyle[key];
                }
            }
        } else {
            item.optionItem.style = rowStyle;
        }
    }
    // 动态 field（子表单）
    if (entity) {
        item.field = `children.${entity}.${item.field}`;
    }
    // spans 值的修正
    if (spanAdjust && !item.span) {
        item.span = spanAdjust;
    }
    // 初始值设置
    // raftValue(item, values);
};
const raftCell = (cell = {}, config = {}, raft) => {
    const {rowStyle = {}, params = {}} = config;
    // 高度修正
    raftItem(cell, {}, rowStyle);
    /*
     * 解决 rowStyle, 处理Cell和 <Col/>
     */
    const column = Col.raftColumn(raft, Abs.clone(params));
    /*
     * 处理 title 和 $button
     */
    Col.raftSpecial(column);

    column.render = Rdr.raftRender(raft, Abs.clone(params));
    return column;
};
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    raftCell,
    raftItem,
}