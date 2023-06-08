import __Zn from './zero.uca.dependency';

const __columnWrapper = (column = {}, fnRender) => {
    return (text, record = {}, index) => {
        const {key} = record;
        const jsx = {};
        jsx.children = __Zn.isFunction(fnRender) ?
            fnRender(text, record, index) : text;
        jsx.props = {};
        const {$config = {}} = column;
        const {rowSpan} = $config;
        if ("number" === typeof rowSpan) {
            /*
             * 静态处理，直接使用数字
             */
            jsx.props.rowSpan = rowSpan;
        } else {
            const source = record[rowSpan];
            /*
             * 使用非数字
             */
            const foundIndex = __Zn.elementIndex(source, key, 'key');
            if (0 === foundIndex) {
                jsx.props.rowSpan = source.length;
            } else {
                jsx.props.rowSpan = 0;
            }
        }
        return jsx;
    }
}
const columnSynonym = (reference, column = {}) => {
    const {$synonym = {}} = reference.props;
    if ($synonym?.hasOwnProperty(column.dataIndex)) {
        column.title = $synonym[column.dataIndex]
    }
    return column;
};
const columnSorter = (reference = {}, column = {}) => {
    /* 是否开启可控 */
    const {$stateSorter = false} = reference.state ? reference.state : {};
    if ($stateSorter) {
        if (column.sorter) {
            /* FIX：解决排序和过滤同时出现的情况，这种情况排序需要受控 */
            const {$sorter = {}} = reference.state ? reference.state : {};
            if (__Zn.isEmpty($sorter)) {
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
}
const columnWrapper = (reference, column = {}) => {
    let fnOriginal;
    if (__Zn.isFunction(column.render)) {
        fnOriginal = column.render;
        delete column.render;
    }
    const {$config = {}} = column;
    if (!__Zn.isEmpty($config)) {
        const {wrapper = false} = $config;
        if (wrapper) {
            const {rowSpan} = $config;
            if (undefined !== rowSpan) {
                column.render = __columnWrapper(column, fnOriginal)
            }
        }
    }
    if (!column.render) {
        if (__Zn.isFunction(fnOriginal)) {
            column.render = fnOriginal;
        }
    }
    return column;
};

export default {
    columnSynonym,
    /*
     * 由于系统在点击表格的 onChange 会优先触发一个 loading 的效果
     * 也就是说这个 loading 效果会使得 sorter 必须要受控，否则一旦 setState
     * 排序的内容就会被还原，导致排序失效，这种情况在不设置 filter 的时候是不存在的
     * 所以设置内置属性：
     * 1. $stateSorter 变量用于控制
     * 2. $condition 则是真正需要使用的查询条件
     */
    columnSorter,
    columnWrapper,
}