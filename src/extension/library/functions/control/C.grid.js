import U from "underscore";

/*
 * 样本
 * 1. 布局行：
 *      - key：React专用
 *      - columns：列中必定包含Col标签
 * 2. 布局列
 *     2.1. 包含行布局（递归节点）
 *      - key：React专用
 *      - rows：列中的行定义
 *      - span：列宽
 *     2.2. 不包含行布局（最子节点）
 *      - key：React专用
 *      - id：列对应的Control的id
 *      - span：列宽
 *      - control：列对应的配置
 * @param item
 * @param prefix
 * @param control
 */

const toColItem = (item, prefix, control = {}) => {
    const column = {};
    column.key = prefix;
    if ("string" === typeof item) {
        column.span = 24;
        column.control = {
            ...control[item],
            id: item,   // control 中带 id
        };
        column.id = item;
    } else {
        column.span = item.span;
        if (U.isArray(item.value)) {
            // 列嵌套行
            column.rows = [];
            item.value.forEach((each, index) => column.rows.push(toRowItem(each, prefix + index, control)));
        } else if ("string" === item.value) {
            column.id = item.value;
            column.control = {
                ...control[item.value],
                id: item.value, // control 中带 id
            };
        }
    }
    if (item.xs) column.xs = item.xs;
    if (item.sm) column.sm = item.sm;
    if (item.md) column.md = item.md;
    if (item.lg) column.lg = item.lg;
    if (item.xl) column.xl = item.xl;
    if (item.xxl) column.xxl = item.xxl;
    return column;
};
const toRowItem = (item, prefix, control) => {
    const row = {};
    row.key = prefix;
    if ("string" === typeof item) {
        row.columns = [toColItem(item, prefix, control)];
    } else {
        // 先处理列
        row.columns = [];
        item.forEach((each, index) => row.columns.push(toColItem(each, prefix + index, control)));
    }
    return row;
};
/**
 * ## 扩展函数
 *
 * Grid布局扩展配置。
 *
 * @memberOf module:_config
 * @param {Array<Array>} grid 矩阵专用扩展Grid布局配置
 * @param {Object} control 控件表
 * @param {String} prefix 前缀信息，用于识别组件的key专用
 * @returns {Array} 返回最终布局
 */
const configGrid = (grid = [], control = {}, prefix) => {
    // 行处理
    const rows = [];
    grid.forEach((item, index) => rows.push(toRowItem(item, prefix + index, control)));
    return rows;
};

export default {
    configGrid
}