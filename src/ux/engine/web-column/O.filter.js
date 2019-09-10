import renderSearch from './I.fn.filter.search';
import renderDirect from './I.fn.filter.direct';

const columnFilter = (column = {}, reference = {}) => {
    if (column.hasOwnProperty("$filter")) {
        if (column.hasOwnProperty("key")) {
            delete column.key;
        }
        const {$filter = {}} = column;
        const {config = {}, type = "DIRECT"} = $filter;
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