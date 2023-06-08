import React from 'react';
import Ux from 'ux';
import Ex from 'ex';

import Rdr from './Web';
import {ExHistory} from "ei";
import {Dsl} from 'entity';

import "./Cab.norm.scss";
import Sk from 'skin';

/**
 * ## 「组件」`OxHistory`
 *
 * ### 1. 生命周期
 *
 * |Hoc高阶周期|Mount初始化|Update更新|
 * |---|---|---|
 * |Ok|Ok|x|
 *
 * @memberOf module:uca/extension
 * @method OxHistory
 */
// =====================================================
// componentInit/componentUp
// =====================================================

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
            // reference.?etState({$row, $loading: true});
            Ux.of(reference).in({$row}).loading(false).handle(() => {
                $row = Ux.clone($row);
                Ux.ajaxGet("/api/history/:key", {key: record.key})
                    .then(($data = {}) => {
                        $row[record.key] = {$data, $loading: false};
                        Ux.of(reference).in({$row}).load(false).done();
                        // reference.?etState({$row, $loading: false});
                    })
            })
            // $row = Ux.clone($row);
            // Ux.ajaxGet("/api/history/:key", {key: record.key})
            //     .then(($data = {}) => {
            //         $row[record.key] = {$data, $loading: false};
            //         reference.?etState({$row, $loading: false});
            //     })
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
        const attrTb = Sk.mixOx("OxHistory", null, {
            _className: "ux_table"
        });
        Object.assign($table, attrTb);
        $table.expandable = {
            expandedRowRender: renderRow(reference),
        }
        $table.onExpand = rxExpand(reference);
        state.$table = $table;
        /*
         * 1）全列读取拿到 datum 专用
         * 2）读取 histories 数据
         */
        const params = {identifier: $identifier, key: $inited.key};
        return Ux.parallel([
            Ux.ajaxGet(`/api/${Ux.Env.ROUTE}/columns/:module/full`, {module: $identifier})
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
                const $data = Ux.clone(response.data);
                $data.sort(Ux.sorterDescDFn('createdAt'));
                state.$data = $data;
            }
            /*
             * 统计属性数量
             */
            return Ux.ajaxEager(reference, state.$table.columns, state.$data)
                .then($lazy => Ux.promise(state, "$lazy", $lazy));
        });
    } else {
        state.$error = "模型选择失败！";
        state.$ready = true;
        return Ux.promise(state);
    }
}
const componentInit = (reference) => {
    const state = {};
    return yiTimePage(reference, state)
        .then(state => Ux.capTab(reference, "tabs", state))
        .then(Ux.ready).then(Ux.pipe(reference))
        .catch(error => console.error(error))
}

@Ux.zero(Ux.rxEtat(require("./Cab"))
    .cab("ExHistory")
    .state({
        $row: {}
    })
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        componentInit(this);
    }

    render() {
        return Ex.yoRender(this, () => {
            return Ux.aiTabPage(this, {
                // 按时间
                tabTime: Rdr.renderTime(this),
                // 按字段
                tabField: Rdr.renderField(this)
            })
        }, Ex.parserOfColor("OxHistory").component())
    }
}

export default Component;