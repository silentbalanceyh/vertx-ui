import Expr from '../expression';
import Abs from '../../abyss';
import Column from "../web-column";

/**
 * Ant Design的Table组件的Table组件专用属性`columns`列处理器，处理每一列的`render`属性
 * @method uiTableColumn
 * @param reference React对应组件引用 React.PureComponent
 * @param {Array} columns 当前Table组件的columns配置
 * @param ops 当前列是否可操作列：如列中包含了编辑、删除按钮
 * @return {Array}
 */
const configColumn = (reference, columns = [], ops = {}) => {
    /*
     * 先执行基本解析
     */
    columns = Expr.aiExprColumn(columns);
    /*
     * 构造 OP 列的处理（固定列渲染）
     */
    const $op = Abs.immutable([
        "BUTTON",   // 最早的 ComplexList专用版本（按钮模式）
        "OP",       // 最早的 Op 专用版本（按钮链接双模式）
        "LINK",     // 最早的 ComplexList专用版本（链接模式）
        /* 废除了 ACTION，添加新的 EXECUTOR 模式 */
        "EXECUTOR"  // 最新版 ExComplexList
    ]);
    /*
     * 遍历每一个列执行注入
     */
    columns.forEach(column => {
        // $render处理
        Column.columnRender(column, reference, ops);
        // fixed固定值处理
        Column.columnFixed(column, $op);
        // $filter过滤处理
        Column.columnFilter(column, reference);
        // sorter = true 是否开启可控模式
        Column.columnSorter(column, reference);
    });
    return columns;
};

export default {
    configColumn
}