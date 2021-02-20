import Ux from 'ux';
import T from './Op.Data';
import {Tag} from "antd";
import React from "react";

const yiPage = (reference) => {
    const {config = {}, /* 基本配置 */} = reference.props;
    const {
        table = {},
        query = {},
        options = {},
        connect = [],
    } = config;
    // 表格配置
    const $table = Ux.clone(table);
    $table.columns = Ux.configColumn(reference, $table.columns);
    // rowClassName 计算
    const {css = {}} = options;
    $table.size = "small";      // 必须是小的
    if (css.row) {
        $table.rowClassName = (record, index) => {
            if (0 === index % 2) {
                return "";
            } else {
                return css.row;
            }
        }
    }
    const state = {};
    state.$table = $table;

    // 执行 onChange 事件的注入流程
    const $query = Ux.clone(query);
    state.$queryDefault = $query;
    state.$query = $query;

    // 执行 options 部分的构造
    state.$options = Ux.clone(options);

    state.$extra = connect.filter(item => {
        const {config = {}} = item;
        return "EXTRA" === config.pos;
    }).map(item => T.yiAction(reference, item));

    // window 专用配置
    state.$window = T.yiWindow(reference, config);
    state.$connect = connect.filter(item => {
        const {config = {}} = item;
        return "EXTRA" !== config.pos;
    }).map(item => T.yiAction(reference, item));

    // 执行 extra 部分的注入
    T.yiSearch(reference, state)($query);
}
const yoPagination = (reference, $table = {}) => {
    const {$data = {}, $query = {}} = reference.state;
    const {pagination} = $table;
    const {pager = {}} = $query;
    $table.pagination = {
        size: "small",
        pageSize: pager.size,
        showQuickJumper: true,
        total: $data.count,
        showTotal: (total) => (
            <Tag color={"magenta"} style={{fontSize: 14}}>
                {Ux.formatExpr(pagination, {total, page: pager.page})}
            </Tag>
        )
    }
}
export default {
    yiPage,
    yoPagination
}