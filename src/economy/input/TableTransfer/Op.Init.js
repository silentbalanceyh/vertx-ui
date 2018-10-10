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
    table.className = "web-table-transfer-table";
    // 列专用处理
    table.columns.forEach(column => {
        if (!column.hasOwnProperty('className')) {
            column.className = "col-100";
        }
        column.render = _getRender(reference, column, to);
    });
    // 默认带操作，设10
    table.indentSize = 10;
    return table;
};
const _getRender = (reference, column = [], to = false) => {
    let fnRender = column.render;
    if ("key" === column.dataIndex) {
        fnRender = Rdr.renderOp(reference, to, column);
    } else {
        if ("LABEL" !== column['$render']) {
            fnRender = Rdr.renderInput(reference, column.dataIndex);
        }
    }
    return fnRender;
};
const getInit = (reference) => {
    const state = Ux.xtInitArray(reference.props, true);
    let {config = {}, source = []} = reference.props;
    config = Ux.clone(config);
    const {from = {}, to = {}} = config;
    state.toTable = _getTable(reference, from, true);
    state.fromTable = _getTable(reference, to, false);
    // 基础配置
    config.filter = _getFilter(config, state.fromTable.columns);
    config.tree = _getTree(config);
    state.config = config;
    state.filters = {};
    // 数据配置
    state._data = source;
    return state;
};

const _getTree = (config = {}) => {
    const tree = config.tree;
    const treeData = {};
    if (tree) {
        if ("string" === typeof tree) {
            const treeArr = tree.split(',');
            if (treeArr[0]) treeData.field = treeArr[0];
            if (treeArr[1]) treeData.key = treeArr[1];
            if (treeArr[2]) treeData.sorter = treeArr[2];
        } else {
            Object.assign(treeData, tree);
        }
    }
    if (!treeData.field) treeData.field = "parentId";
    if (!treeData.key) treeData.key = "key";
    if (!treeData.sorter) treeData.sorter = "code";
    return treeData;
};

export default {
    getInit
};