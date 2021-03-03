import Ux from 'ux';
import Ex from 'ex';
import React from 'react';
import {Tag} from "antd";
import Op from './Op.Event';
import T from './Op.T';

const yiPage = (reference) => {
    const table = Ux.fromHoc(reference, "table");
    const $table = Ux.clone(table);
    $table.columns = Ux.configColumn(reference,
        table.columns, Ux.configExecutors(reference, Op.events));

    $table.onChange = (pager = {}) => {
        const {current} = pager;
        const {$query = {}} = reference.state;
        $query.pager.page = current;
        reference.setState({$submitting: true})
        T.rxDataRefresh(reference, query)
    }

    const state = {};
    state.$table = $table;

    /*
     * 默认参数
     */
    const query = Ux.fromHoc(reference, "query");
    state.$queryDefault = Ux.clone(query);
    state.$query = Ux.clone(query);
    state.$extra = Ux.sexOp(reference, Op.events);
    Ex.yiAssist(reference, state).then(processed => T.rxDataRefresh(reference, query, processed))
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
export default {
    yiPage,
    yoPagination,
    ...T,
}