import webFilter from '../web-column-filter';
import U from 'underscore';

export default (reference = {}, column = {}) => {
    if (column.hasOwnProperty("$filter")) {
        if (column.hasOwnProperty("key")) {
            /*
             * 仅保留 dataIndex 作为唯一的列标识
             */
            delete column.key;
        }
        const {$filter = {}} = column;
        const {config = {}, type = "DIRECT"} = $filter;
        const executor = webFilter[type];
        if (U.isFunction(executor)) {
            /*
             * 满足信息的相关处理
             */
            executor(reference, column, config);
        } else {
            console.error(`[Err] type = ${type} 的模式目前不支持！`);
        }
    }
}