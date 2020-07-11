import Ux from 'ux';
import Ex from 'ex';
import React from 'react';
import {ExHistory} from 'ei';
import {Dsl} from 'entity';

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
        <div style={{marginBottom: 3}}>
            <ExHistory {...attrs} data={data}
                       $dict={$dict}/>
        </div>
    )
};
const rxExpand = (reference) => (expanded, record = {}) => {
    if (expanded) {
        /*
         * 展开，每次展开的时候执行行的 loading
         */
        let {$row = {}} = reference.state;
        $row = Ux.clone($row);

        /*
         * 展开时不执行第二次加载
         */
        const rowData = $row[record.key];
        if (!rowData) {
            $row[record.key] = {$loading: true};
            reference.setState({$row, $loading: true});
            /*
             * $row
             */
            $row = Ux.clone($row);
            Ux.ajaxGet("/api/history/:key", {key: record.key})
                .then(($data = {}) => {
                    $row[record.key] = {$data, $loading: false};
                    reference.setState({$row, $loading: false});
                })
        }
    }
};

const yiTimePage = (reference, state = {}) => {
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
        return Ux.parallel([
            Ux.ajaxGet("/api/ox/columns/:module/full", {module: $identifier})
                .then(columns => {
                    const auditor = Ux.fromHoc(reference, "auditor");
                    let merged = Ux.clone(columns);
                    if (Ux.isArray(auditor) && 0 < auditor.length) {
                        merged = merged.concat(Ux.configColumn(reference, auditor));
                    }
                    state.$a_model_columns = Dsl.getArray(columns);   // 给第二个界面使用
                    return Ux.promise(merged);
                })
                .then(columns => Ex.mapAsyncDatum(columns, reference)),
            Ux.ajaxGet("/api/history/:identifier/:key", params),
        ], "dict", "data").then(response => {
            state.$dict = response['dict'];
            if (Ux.isArray(response.data)) {
                state.$data = response.data.sort(Ux.sorterDescDFn('createdAt'));
            }
            /*
             * 添加 lazy 流程
             */
            const lazyColumn = state.$table.columns
                .filter(item => "USER" === item['$render']);
            /*
             * 统计属性数量
             */
            return Ux.ajaxEager(reference, lazyColumn, state.$data)
                .then($lazy => Ux.promise(state, "$lazy", $lazy));
        });
    } else {
        state.$error = "模型选择失败！";
        state.$ready = true;
        return Ux.promise(state);
    }
};
export default {
    yiTimePage
}