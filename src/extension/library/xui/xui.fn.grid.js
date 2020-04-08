import React from 'react';
import {Col, Row} from 'antd';

import xuiDecorator from './xui.fn.decorator';

const getRender = (column = {}, UI = {}, inherit = {}) => {
    /*
     * 默认什么内容都不渲染
     */
    let fnRender;
    if (column.hasOwnProperty("rows")) {
        // 递归渲染
        fnRender = () => xuiGrid(column.rows, UI, inherit);
    } else {
        // 组件渲染
        fnRender = () => xuiDecorator(column.control, UI, inherit);
    }
    return fnRender;
};

const xuiColumn = (column) => {
    const attrs = {};
    attrs.key = column.key;
    attrs.span = column.span;
    if (column.xs) attrs.xs = column.xs;
    if (column.sm) attrs.sm = column.sm;
    if (column.md) attrs.md = column.md;
    if (column.lg) attrs.lg = column.lg;
    if (column.xl) attrs.xl = column.xl;
    if (column.xxl) attrs.xxl = column.xxl;
    return attrs;
};
/**
 * ## 扩展函数
 *
 * 执行 `xuiGrid` 专用Grid控件布局。
 *
 * @memberOf module:_xui
 * @method xuiGrid
 * @param {Array<Array>} grid Grid布局专用二维数组配置
 * @param {Object} UI 组件配置
 * @param {Object} inherit 将被继承的属性表
 * @returns {Jsx} 渲染行列`<Row>, <Col>`的Grid组件
 */
const xuiGrid = (grid = [], UI = {}, inherit = {}) =>
    grid.map(row => {
        const {columns = [], key} = row;
        return (
            <Row key={key}>
                {columns.map(column => {
                    const fnRender = getRender(column, UI, inherit);
                    // 响应式布局
                    const attrs = xuiColumn(column);
                    return (
                        <Col {...attrs}>
                            {fnRender()}
                        </Col>
                    )
                })}
            </Row>
        )
    });

export default xuiGrid;