import Ux from "ux";
import T from "./Op.T";
import {Tag} from "antd";
import React from "react";

const yiTable = (reference) => {
    const state = {};

    const table = Ux.fromHoc(reference, "table");
    const $table = Ux.clone(table);
    $table.columns = Ux.configColumn(reference, table.columns);
    $table.onChange = (pager = {}) => {
        const {current} = pager;
        const {$query = {}} = reference.state;
        $query.pager.page = current;
        reference.setState({$submitting: true})
        T.rxDataRefresh(reference, query);
    }
    state.$table = $table;

    /*
     * 默认参数
     */
    const query = Ux.fromHoc(reference, "query");
    state.$queryDefault = Ux.clone(query);
    state.$query = Ux.clone(query);
    /*
     * 处理表格
     */
    T.rxDataRefresh(reference, query, state);
}
const yuTable = (reference, virtualRef) => {

}
const yoPagination = ($table = {}, reference) => {
    const {$data = {}} = reference.state;
    const {pagination} = $table;
    $table.pagination = {
        size: "small",
        pageSize: 14,
        showQuickJumper: true,
        total: $data.count,
        showTotal: (total) => (
            <Tag color={"magenta"} style={{fontSize: 14}}>
                {Ux.formatExpr(pagination, {total})}
            </Tag>
        )
    }
    return $table;
}
const rxSearch = (reference) => (event) => {
    const $keyword = Ux.ambEvent(event);
    reference.setState({$keyword});
}
const rxSearchQuick = (reference) => (keyword) => {
    const $query = T.rxDataQuery(reference, "keyword", keyword);
    T.rxDataRefresh(reference, $query)
}
export default {
    yiTable,
    yuTable,
    yoPagination,
    // 绑定按钮
    rxSearch,
    rxSearchQuick
}