import __Zn from './zero.module.dependency';
import __ADJ from './form.__.fn.adjust.special';
import __Rdr from './form.equip.__.fn.raft.04.render';

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

const raftColumn = (raft = {}, config = {}) => {
    const {cell = {}, index = 0, calculated = {}, row = {}} = config;
    const {
        entity,
        spans = [],
        span,
    } = calculated;
    const {options = {}} = raft;
    const $cell = __Zn.clone(cell);
    /*
     * 修正 span
     * 1）布局修正数据中存在数据
     * 2）本身没有配置任何 span，不使用默认
     */
    if (spans[index] && !$cell.span) {
        $cell.span = spans[index];
    }
    /*
     * 动态子表单的字段重命名
     */
    if (entity) {
        $cell.field = `children.${entity}.${cell.field}`;
    }
    /*
     * 高度修正处理，构造 col
     */
    const col = {};
    col.span = $cell.span ? $cell.span : span;
    col.key = $cell.field;
    const style = {};
    if ($cell.optionItem && $cell.optionItem.style) {
        const original = $cell.optionItem.style;
        if (original.hasOwnProperty('height')) {
            style.height = original.height;
        }
    }
    col.style = style;
    $cell.col = col;
    /*
     * 布局计算
     */
    const configuration = {
        rowIndex: row.index, span,
        cellIndex: index,
        columns: row.length,
        window: options.window,
        entity,
    };
    __Zn.aiLayout($cell, configuration);
    return $cell;
};
const raftSpecial = (cell = {}) => {
    /*
     * field = $button
     */
    __ADJ.adjustButton(cell);
    /*
     * type = title 类别的调整
     * type = subject 类别的调整
     */
    __ADJ.adjustHeader(cell);
    cell.key = cell.field;
};
const raftCell = (cell = {}, config = {}, raft) => {
    const {rowStyle = {}, params = {}} = config;
    // 高度修正
    raftItem(cell, {}, rowStyle);
    /*
     * 解决 rowStyle, 处理Cell和 <Col/>
     */
    const column = raftColumn(raft, __Zn.clone(params));
    /*
     * 处理 title 和 $button
     */
    raftSpecial(column);

    column.render = __Rdr.raftRender(raft, __Zn.clone(params));
    return column;
};
export default {
    // optionItem
    raftItem,
    // col / column for grid
    raftColumn,
    // raft header / $button position
    raftSpecial,
    // Not Used
    raftCell,
}