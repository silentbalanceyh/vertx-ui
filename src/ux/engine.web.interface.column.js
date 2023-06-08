// 默认导入
// 引擎内
// 引擎外
import __Zs from 'zs';

const exported = {
    /**
     * ## 「标准」`Ux.columnFilter`
     * @memberOf module:column/zest
     * @param reference
     * @param column
     */
    columnFilter: (reference = {}, column = {}) =>
        __Zs.columnFilter(reference, column),
    /**
     * ## 「标准」`Ux.columnSorter`
     *
     * 由于系统在点击表格的 onChange 会优先触发一个 loading 的效果
     * 也就是说这个 loading 效果会使得 sorter 必须要受控，否则一旦 setState
     * 排序的内容就会被还原，导致排序失效，这种情况在不设置 filter 的时候是不存在的
     * 所以设置内置属性：
     *
     * 1. $stateSorter 变量用于控制
     * 2. $condition 则是真正需要使用的查询条件
     *
     * @memberOf module:column/zest
     * @param reference
     * @param column
     */
    columnSorter: (reference = {}, column = {}) =>
        __Zs.columnSorter(reference, column),
    /**
     * ## 「标准」`Ux.columnRender`
     * @memberOf module:column/zest
     * @param reference
     * @param column
     * @param ops
     */
    columnRender: (reference = {}, column = {}, ops) =>
        __Zs.columnRender(reference, column, ops),
    /**
     * ## 「标准」`Ux.columnWrapper`
     *
     * @memberOf module:column/zest
     * @param reference
     * @param column
     * @returns {{}}
     */
    columnWrapper: (reference, column = {}) =>
        __Zs.columnWrapper(reference, column),
    /**
     * ## 「标准」`Ux.columnSynonym`
     *
     * @memberOf module:column/zest
     * @param reference
     * @param column
     * @returns {{}}
     */
    columnSynonym: (reference, column = {}) =>
        __Zs.columnSynonym(reference, column)
};
export default exported;