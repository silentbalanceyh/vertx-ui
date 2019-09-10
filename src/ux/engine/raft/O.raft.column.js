import Abs from '../../abyss';
import Grid from '../layout';
import Adjust from './O.raft.adjust';

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
    /*
     * field = $button
     */
    Adjust.adjustButton(cell);
    /*
     * type = title 类别的调整
     */
    Adjust.adjustTitle(cell);

    cell.key = cell.field;
};
export default {
    raftColumn,
    raftSpecial,
}