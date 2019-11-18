import Ux from 'ux';
import Ex from 'ex';
import React from 'react';
import {ExHistory} from 'ei';

const renderRow = (reference) => (record = {}) => {
    const {$row = {}, $dict = {}} = reference.state;
    let recordData = $row[record.key];
    /*
     * 数据拼接
     */
    const data = Ux.clone(record);
    data.items = Ux.clone(recordData.$data ? recordData.$data : []);
    const attrs = Ex.yoAmbient(reference);
    return (
        <ExHistory {...attrs} data={data}
                   $dict={$dict}
                   $loading={recordData.$loading}/>
    )
};
const rxExpand = (reference) => (expanded, record = {}) => {
    if (expanded) {
        /*
         * 展开，每次展开的时候执行行的 loading
         */
        let {$row = {}} = reference.state;
        $row = Ux.clone($row);
        $row[record.key] = {$loading: true};
        reference.setState({$row});
        /*
         * $row
         */
        $row = Ux.clone($row);
        Ux.ajaxGet("/api/history/:key", {key: record.key})
            .then(($data = {}) => {
                $row[record.key] = {$data, $loading: false};
                reference.setState({$row});
            })
    }
};

const yiPage = (reference) => {
    const state = {};
    state.$ready = true;
    /*
     * 参数构造
     * 1) 针对 full column 的构造（用于处理字典）
     * 2) 针对 变更历史数据的读取
     */
    const {$identifier, $inited = {}} = reference.props;
    /*
     * 参数构造
     */
    if ($identifier && !Ux.isEmpty($inited)) {
        /*
         * 表格处理
         */
        const table = Ux.fromHoc(reference, "history");
        const $table = Ux.clone(table);
        $table.columns = Ux.configColumn(reference, table.columns);
        $table.pagination = false;
        $table.className = "web-table ox-history";
        $table.expandedRowRender = renderRow(reference);
        $table.onExpand = rxExpand(reference);
        state.$table = $table;
        /*
         * 1）全列读取拿到 datum 专用
         * 2）读取 histories 数据
         */
        const params = {identifier: $identifier, key: $inited.key};
        Ux.parallel([
            Ux.ajaxGet("/api/ox/columns/:module/full", {module: $identifier})
                .then(columns => Ex.mapAsyncDatum(columns, reference)),
            Ux.ajaxGet("/api/history/:identifier/:key", params),
        ], "dict", "data").then(response => {
            /*
             * 配置绑定在静态里，由于 extension 在后端有 XActivity / XActivityChange 支撑
             */
            state.$dict = response['dict'];
            state.$data = response.data;
            /*
             * 统计属性数量
             */
            reference.setState(state);
        });
    } else {
        state.$error = "模型选择失败！";
        reference.setState(state);
    }
};
export default {
    yiPage
}