import Ux from 'ux';

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