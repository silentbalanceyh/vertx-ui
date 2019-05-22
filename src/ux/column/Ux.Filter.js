import renderSearch from './Ux.Filter.Search';
import renderDirect from './Ux.Filter.Direct';
import renderSorter from './Ux.Sorter';

const columnFilter = (column = {}, reference = {}) => {
    if (column.hasOwnProperty("$filter")) {
        if (column.hasOwnProperty("key")) {
            delete column.key;
        }
        const {$filter = {}} = column;
        const {config = {}, type = "DIRECT"} = $filter;
        // Fix 解决过滤和排序同时存在时无法生效的问题，排序改成受控模式
        renderSorter(reference, column, config);
        // 直接解析
        if ("DIRECT" === type) {
            renderDirect(reference, column, config);
        } else if ("SEARCH" === type) {
            renderSearch(reference, column, config);
            /* 特殊情况的问题解决 */
        } else {
            console.error(`[Err] type = ${type} 的模式目前不支持！`);
        }
    }
};
export default {
    columnFilter
};