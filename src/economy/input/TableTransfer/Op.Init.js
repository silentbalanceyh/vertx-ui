import Ux from "ux";

const _getFilter = (config = {}, columns = []) => {
    let filterKeys = [];
    if ("string" === typeof config.filter) {
        filterKeys = config.filter.split(',');
    }
    const items = [];
    filterKeys.forEach(key => {
        let unique = columns.filter(column => key === column.dataIndex);
        if (1 === unique.length) {
            unique = unique[0];
            const item = {};
            item.key = unique.dataIndex;
            item.placeholder = unique.title;
            item.config = Ux.clone(unique);
            items.push(item);
        }
    });
    return items;
};
const _getColumn = (reference, columns = []) => {
    columns.forEach(column => {
        if (!column.hasOwnProperty('className')) {
            column.className = "col-100";
        }
    });
    return columns;
};
const getInit = (reference) => {
    const state = Ux.xtInitArray(reference.props, true);
    const {config = {}, table = {}, source = []} = reference.props;
    // 表格配置
    table.pagination = false;
    table.columns = Ux.xtColumn(reference, table.columns);
    // 列专用处理
    table.columns = _getColumn(reference, table.columns);
    table.className = "web-table-editor";
    // 基础配置
    config.filter = _getFilter(config, table.columns);
    state.config = config;
    state.table = table;
    state.filters = {};
    // 数据配置
    state._data = source;
    return state;
};

export default {
    getInit
}