import Ux from 'ux';
/*
 * 由于系统在点击表格的 onChange 会优先触发一个 loading 的效果
 * 也就是说这个 loading 效果会使得 sorter 必须要受控，否则一旦 setState
 * 排序的内容就会被还原，导致排序失效，这种情况在不设置 filter 的时候是不存在的
 * 所以设置内置属性：
 * 1. $stateSorter 变量用于控制
 * 2. $condition 则是真正需要使用的查询条件
 */
const columnSorter = (column = {}, reference) => {
    /* 是否开启可控 */
    const {$stateSorter = false} = reference.state ? reference.state : {};
    if ($stateSorter) {
        if (column.sorter) {
            /* FIX：解决排序和过滤同时出现的情况，这种情况排序需要受控 */
            const {$sorter = {}} = reference.state ? reference.state : {};
            if (Ux.isEmpty($sorter)) {
                // 没有排序规则
                column.sortOrder = false;
            } else {
                if ($sorter.order && $sorter.field === column.dataIndex) {
                    column.sortOrder = $sorter.order;
                } else {
                    // 不属于当前字段排序
                    column.sortOrder = false;
                }
            }
        }
    }
};
export default {
    columnSorter
}