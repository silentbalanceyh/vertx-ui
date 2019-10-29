import Expr from '../expression';
import Abs from '../../abyss';
import Column from "../web-column";
import U from "underscore";

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
     * 遍历每一个列执行注入
     */
    columns.forEach(column => {
        // $render处理
        Column.columnRender(column, reference, ops);
        // fixed固定值处理
        // Column.columnFixed(column, $op);
        // $filter过滤处理
        Column.columnFilter(column, reference);
        // sorter = true 是否开启可控模式
        Column.columnSorter(column, reference);
        // 计算当前列的宽度
    });
    return columns;
};
const configTable = (reference, table = {}, ops = {}) => {
    /*
     * 基本表格
     * 1）无分页
     * 2）计算了 scroll
     */
    const $table = Abs.clone(table);
    $table.pagination = false;
    $table.columns = configColumn(reference, table.columns, ops);
    return $table;
};
/*
 * 统一执行 executor
 * 函数格式：
 * const fun = (reference) => (id, record) => {}
 * 1）reference：当前组件，如 ExTable
 * 2）id：记录的ID
 * 3）record：记录数据全部
 * 合并 executor 的方式：
 * 1）来源于 reference.props 中的 $executor 变量
 * 2）标准函数：
 * -- fnEdit：打开编辑Tab页专用
 * -- fnDelete：删除一行记录专用
 */
const configExecutor = (reference, EVENTS) => {
    /*
     * 基本规范，executor 必须是 fn 打头的
     */
    const events = {};
    Object.keys(EVENTS)
        .filter(key => key.startsWith('fn'))
        .filter(key => U.isFunction(EVENTS[key]))
        .forEach(key => events[key] = EVENTS[key]);
    let executor = Abs.clone(events);
    const {$executor = {}} = reference.props;
    if (!Abs.isEmpty($executor)) {
        /*
         * 如果 $executor 中包含了 fnEdit / fnDelete 会被覆盖掉
         */
        Object.assign(executor, $executor);
    }
    return executor;
};
export default {
    configColumn,
    configTable,
    configExecutor
}