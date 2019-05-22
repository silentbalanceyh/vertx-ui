import Ux from 'ux';

export default (reference, column = {}, config = {}) => {
    if (column.sorter) {
        /* FIX：解决排序和过滤同时出现的情况，这种情况排序需要受控 */
        const {$sorter = {}} = reference.state ? reference.state : {};
        if (Ux.isEmpty($sorter)) {
            column.sortOrder = false;
        } else {
            if ($sorter.order) {
                column.sortOrder = $sorter.order;
            }
        }
    }
};