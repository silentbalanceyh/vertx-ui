import Ux from 'ux';
import {Of} from 'app';
import {Dsl} from 'entity';
import events from './Op.Event';
import React from 'react';
import {Tag} from "antd";

const yiPage = (reference) => {
    const table = Ux.fromHoc(reference, "table");
    const $table = Ux.clone(table);
    $table.columns = Ux.configColumn(reference,
        table.columns, Ux.configExecutors(reference, events));

    $table.columns.filter(item => "status" === item.dataIndex).forEach(column => {
        const {$mapping = {}} = column;
        column.render = (text) => {
            const display = $mapping[text];
            const className = "RUNNING" === text ? "tip-run" : "tip-stop";
            return (
                <span className={"tip"}>
                    <span className={className}>•</span>
                    <span>{display}</span>
                </span>
            )
        }
    })
    $table.onChange = (pager = {}) => {
        const {current} = pager;
        const {$query = {}} = reference.state;
        $query.pager.page = current;
        Dsl.of(reference).bind(Of.apiTaskSearch).ok(response => {
            const state = {};
            state.$data = response;
            state.$query = $query;
            reference.setState(state);
        }).async($query);
    }

    const state = {};
    state.$table = $table;

    /*
     * 多窗口专用的 dialog
     */
    const dialog = Ux.fromHoc(reference, "window");
    const $dialog = [];
    $dialog.push(Ux.configDialog(reference, dialog['step1']));
    $dialog.push(Ux.configDialog(reference, dialog['step2']));
    $dialog.push(Ux.configDialog(reference, dialog['step3']));

    state.$dialog = $dialog;

    /*
     * 默认参数
     */
    const query = Ux.fromHoc(reference, "query");
    state.$queryDefault = Ux.clone(query);
    state.$query = Ux.clone(query);

    state.$extra = Ux.sexOp(reference, events);
    Dsl.of(reference).bind(Of.apiTaskSearch).ok(response => {
        state.$data = response;
        state.$ready = true;
        reference.setState(state);
    }).async(query);
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
    yoPagination
}