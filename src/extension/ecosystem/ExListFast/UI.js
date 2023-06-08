import React from 'react';
import Ex from "ex";
import Ux from 'ux';
import Op from './Op';
import {Table} from 'antd';

/**
 * ## 「组件」`ExListOpen`
 *
 * ### 1. 生命周期
 *
 * |Hoc高阶周期|Mount初始化|Update更新|
 * |---|---|---|
 * |x|Ok|x|
 *
 * ### 2. 核心
 *
 * 属性 props
 *
 * ```js
 * {
 *     "config": {
 *          "query": "默认查询",
 *          "table": "表格配置"
 *     }
 * }
 * ```
 *
 * @memberOf module:uca/extension
 * @method ExListOpen
 */
// =====================================================
// componentInit/componentUp
// =====================================================
const UCA_NAME = "ExListFast";
const componentInit = (reference) => {
    const {
        config = {},
        $executor = {},
        /* 基本配置 */
    } = reference.props;
    const {
        table = {},
        query = {}
    } = config;
    const state = {};
    // 执行 onChange 事件的注入流程
    state.$queryDefault = Ux.clone(query);
    const $query = Ex.yiListQuery(reference, query);
    state.$query = $query;
    // 表格处理
    const $table = Ux.clone(table);
    $table.columns = Ux.configColumn(reference, table.columns, $executor);
    state.$table = $table;

    Op.rxRefresh(reference, state, $query)
        .then(Ux.ready).then(Ux.pipe(reference));
}

const componentUp = (reference, virtualRef) => {
    const refreshProp = reference.props.$refresh;
    const refreshPre = virtualRef.props.$refresh;
    if (refreshProp !== refreshPre) {
        // reference.?etState({$loading: true});
        Ux.of(reference).loading(false).handle(() => {
            const query = Op.yoQuery(reference);
            const stateRef = {};
            {
                const {$table = {}} = reference.state;
                stateRef.$table = $table;
            }
            Op.rxRefresh(reference, stateRef, query)
                .then(Ux.ready).then(Ux.pipe(reference));
        })
    }
}

class Component extends React.PureComponent {
    displayName = UCA_NAME;
    state = {
        $loading: true
    }

    componentDidMount() {
        componentInit(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        componentUp(this, {props: prevProps, state: prevState})
    }

    render() {
        return Ex.yoRender(this, () => {
            const {$table = {}, $data = {}, $loading = false} = this.state;
            const config = Ux.clone($table);

            // 分页处理
            Op.yoPager(this, config, $data);
            // 选择
            Op.yoSelection(this, config);
            // 触发双击
            Op.yoRow(this, config);

            const dataSource = Ux.valueArray($data);
            return (
                <Table {...config} dataSource={dataSource} loading={$loading}/>
            )
        }, Ex.parserOfColor(UCA_NAME).list());
    }
}

export default Component