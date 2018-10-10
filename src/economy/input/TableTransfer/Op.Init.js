import Ux from "ux";
import Rdr from "./UI.Render.Op";

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
const _getTable = (reference, table = [], to) => {
    // 表格配置
    table.pagination = false;
    table.columns = Ux.xtColumn(reference, table.columns);
    // 列专用处理
    table.columns.forEach(column => {
        if (!column.hasOwnProperty('className')) {
            column.className = "col-100";
        }
        column.render = _getRender(reference, column, to);
    });
    return table;
};
const _getRender = (reference, column = [], to = false) => {
    let fnRender = column.render;
    if ("key" === column.dataIndex) {
        fnRender = Rdr.renderOp(reference, to);
    }
    return fnRender;
};
const getInit = (reference) => {
    const state = Ux.xtInitArray(reference.props, true);
    const {config = {}, source = []} = reference.props;
    const {from = {}, to = {}} = config;

    state.fromTable = _getTable(reference, from, false);
    state.toTable = _getTable(reference, to, true);
    // 基础配置
    config.filter = _getFilter(config, state.fromTable.columns);

    state.config = config;
    state.filters = {};
    // 数据配置
    state._data = source;
    console.info(state);
    return state;
};

export default {
    getInit
};