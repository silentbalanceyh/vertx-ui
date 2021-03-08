import Ux from 'ux';
import {Tag} from "antd";
import React from "react";

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
    yoPagination
}