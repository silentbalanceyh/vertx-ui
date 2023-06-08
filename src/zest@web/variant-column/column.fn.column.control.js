import __Zn from './zero.uca.dependency';

const Cv = __Zn.Env;
const WebFilter = __Zn.WEB_FILTER;

const columnRender = (reference = {}, column = {}, ops, renderSource = {}) => {
    const {$render = "PURE"} = column;
    const executor = renderSource[$render];
    if (__Zn.isFunction(executor)) {
        /*
         * 过滤掉不支持过滤的情况
         */
        if (column.hasOwnProperty(Cv.K_NAME.FILTER)) {
            if (Cv.K_VALUE.FILTERED.includes($render)) {
                /*
                 * 支持
                 */
                const $filter = column[Cv.K_NAME.FILTER];
                if (__Zn.isObject($filter)) {
                    const {type = "DIRECT"} = $filter;
                    if ("SEARCH" === type) {
                        /*
                         * 只有搜索类才会处理 highlight 专用
                         */
                        column.highlight = true;
                    }
                }
            } else {
                /*
                 * 列过滤设置过程中，如果出现了不支持列过滤的类型
                 * 则直接删除列过滤配置 $filter
                 */
                delete column[Cv.K_NAME.FILTER];
            }
        }

        column.render = executor(reference, column, ops);
    } else {
        console.error(`[ UxW ] 没有找到对应的 render 函数：${$render}`);
    }
}
const columnFilter = (reference = {}, column = {}) => {
    if (column.hasOwnProperty(Cv.K_NAME.FILTER)) {
        if (column.hasOwnProperty("key")) {
            /*
             * 仅保留 dataIndex 作为唯一的列标识
             */
            delete column.key;
        }
        const {$filter = {}} = column;
        const {config = {}, type = "DIRECT"} = $filter;
        const executor = WebFilter[type];
        if (__Zn.isFunction(executor)) {
            /*
             * 满足信息的相关处理
             */
            executor(reference, column, config);
        }


        const {$condition = {}} = reference.state;
        const value = $condition[column.dataIndex];
        if (__Zn.isArray(value)) {
            // Fix: https://gitee.com/silentbalanceyh/vertx-zero-scaffold/issues/I6VR0K
            if ("BOOLEAN" === config.dataType) {
                column.filteredValue = value.map(each => {
                    if ("boolean" === typeof each) {
                        return each;
                    } else {
                        return each === "true";
                    }
                });
            } else {
                column.filteredValue = value;
            }
        } else {
            column.filteredValue = value ? [value] : null;
        }
    } else {
        column.filteredValue = null;
    }
};
export default {
    columnRender,
    columnFilter,
}