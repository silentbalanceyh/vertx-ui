import Expr from '../expression';
import Abs from '../../abyss';
import Column from "../web-column";
import U from "underscore";

/**
 * ## 引擎函数
 *
 * 「标准配置」Ant Design的Table组件的Table组件专用属性`columns`列处理器，处理每一列的`render`属性
 *
 * @memberOf module:_config
 * @param {ReactComponent} reference React对应组件引用。
 * @param {Array} columns 当前Table组件的columns配置。
 * @param {Object} ops 当前列是否可操作列：如列中包含了编辑、删除按钮，如果出现扩展则执行扩展替换。
 * @return {Array} 返回处理过后的表格列信息。
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
        Column.columnRender(reference, column, ops);
        // $render处理完成过后，可考虑包装
        Column.columnWrapper(reference, column);
        // $filter过滤处理
        Column.columnFilter(reference, column);
        // sorter = true 是否开启可控模式
        Column.columnSorter(reference, column);
        // 计算当前列的宽度
    });
    return columns;
};
/**
 * ## 引擎函数
 *
 * 「标准配置」Table 专用的配置信息。
 *
 * @memberOf module:_config
 * @param {ReactComponent} reference React对应组件引用。
 * @param {Object} table 表格配置数据相关信息。
 * @param {Object} ops 外置处理的 executor 专用信息。
 * @return {Object} 返回处理好的配置信息。
 */
const configTable = (reference, table = {}, ops = {}) => {
    /*
     * 基本表格
     * 1）无分页
     * 2）计算了 scroll
     */
    const $tableInput = Abs.clone(table);
    const {limitation, ...$table} = $tableInput;
    if (!table.hasOwnProperty('pagination')) {
        $table.pagination = false;
    }
    /*
     * 不包含 scroll 属性
     */
    if (!table.hasOwnProperty("scroll")) {
        if (undefined !== limitation && 0 < limitation) {
            const y = 38 * limitation;
            $table.scroll = {
                y
            }
        }
    }
    $table.columns = configColumn(reference, table.columns, ops);
    return $table;
};
/**
 * ## 引擎函数
 *
 * ### 统一执行 executor
 *
 * 函数格式：
 *
 * ```js
 * const fun = (reference) => (id, record) => {}
 * ```
 *
 * 1. reference：当前组件，如 ExTable
 * 2. id：记录的ID
 * 3. record：记录数据全部
 *
 * ### 合并 executor 的方式：
 *
 * 1. 来源于 reference.props 中的 $executor 变量
 * 2. 标准函数：
 *      * fnEdit：打开编辑Tab页专用
 *      * fnDelete：删除一行记录专用
 *
 * @memberOf module:_config
 * @param {ReactComponent} reference React对应组件引用。
 * @param {Object} executors 待绑定的事件专用信息。
 * @return {Object} 返回处理过后的 executors 信息。
 */
const configExecutor = (reference, executors) => {
    /*
     * 基本规范，executor 必须是 fn 打头的
     */
    const events = {};
    Object.keys(executors)
        .filter(key => key.startsWith('fn'))
        .filter(key => U.isFunction(executors[key]))
        .forEach(key => events[key] = executors[key]);
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
const configExecutors = (reference, executors) => {
    const events = {};
    Object.keys(executors)
        .filter(key => U.isFunction(executors[key]))
        .forEach(key => {
            const target = executors[key](reference);
            if (U.isFunction(target)) {
                events[key] = target;
            }
        });
    return events;
}
export default {
    configColumn,
    configTable,
    configExecutor,
    configExecutors,
}