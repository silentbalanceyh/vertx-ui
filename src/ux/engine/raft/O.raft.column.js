import Abs from '../../abyss';
import Grid from '../layout';

const raftColumn = (raft = {}, config = {}) => {
    const {cell = {}, index = 0, calculated = {}, row = {}} = config;
    const {
        entity,
        spans = [],
        span,
    } = calculated;
    const {options = {}} = raft;
    const $cell = Abs.clone(cell);
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
    Grid.aiLayout($cell, configuration);
    return $cell;
};
const raftSpecial = (cell = {}) => {
    // 特殊配置：$button 按钮
    if ("$button" === cell.field) {  // 特殊按钮
        if (cell.optionItem) {
            if (cell.hidden) {
                cell.optionItem.labelCol = {span: 0};
                cell.optionItem.wrapperCol = {span: 24};
            } else {
                cell.optionItem.label = " ";
                cell.optionItem.colon = false;
            }
        }
    }
    // 特殊配置：title
    if (cell.title) {
        if (cell.optionItem) delete cell.optionItem;
        if (cell.optionConfig) delete cell.optionConfig;
        if (cell.optionJsx) delete cell.optionJsx;
        if (cell.render) delete cell.render;
        if (!cell.className) cell.className = "ux-title";
        delete cell.col;
        if (!cell.span) cell.span = 24;
    }
    cell.key = cell.field;
};
export default {
    raftColumn,
    raftSpecial,
}