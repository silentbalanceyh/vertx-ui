import React from 'react';
import __Zn from '../zero.uca.dependency';
import {Button, Popconfirm} from 'antd';

export default {
    yiDefault: (reference = {}) => {
        const {config = {}} = reference.props;
        /*
         * 各部分组件配置处理
         */
        const dialog = __Zn.xtDialogConfig(reference, config);
        const onClick = __Zn.xtDialogClick(reference, config);

        // 通用表格方法
        const table = __Zn.xtTableConfig(reference, config);

        const search = __Zn.xtSearchConfig(reference, config);
        const attrs = {
            onClick, dialog, $ready: true,
            table, search
        };

        return {
            ...attrs,
            $visible: false,
            $loading: false,
            $data: [],
            $keySet: undefined,
        }
    },
    yoTarget: (reference, table = {}) => {
        const $tableTarget = __Zn.clone(table);
        delete $tableTarget.rowSelection;
        /*
         * 核心操作
         */
        const {config = {}} = reference.props;
        const {onClick} = reference.state;
        const {dynamic = {}} = config;

        /*
         * 可操作列
         */
        const $columns = [];
        const action = {
            dataIndex: dynamic.dataIndex,
            className: "ux_table_op",
            width: 100,
            fixed: "left",
            title: (
                <Button icon={__Zn.v4Icon("plus")} className={"uc_pink"}
                        onClick={onClick}>
                    {dynamic.title}
                </Button>
            ),
            render: (text, record) => {
                const {config = {}} = dynamic;
                return (
                    <div style={{textAlign: "center"}}>
                        <Popconfirm title={config.confirm} onConfirm={event => {
                            __Zn.prevent(event);
                            // 读取原始数据
                            const {value = []} = reference.props;
                            let $values = __Zn.clone(value);
                            $values = $values.filter(item => record.key !== item.key);
                            __Zn.fn(reference).onChange($values);
                        }}>
                            {/* eslint-disable-next-line */}
                            <a href={""}>
                                {config.text}
                            </a>
                        </Popconfirm>
                    </div>
                )
            }
        }
        $columns.push(action);

        table.columns.forEach(column => $columns.push(column));
        $tableTarget.columns = $columns;
        return $tableTarget;
    },
    yoPager: __Zn.xtTablePager,
    yoSelected: (reference, table = {}) => {
        const {$keySet} = reference.state;
        if ($keySet) {
            const selectedRowKeys = $keySet.map(item => item.key);
            if (table.rowSelection) {
                table.rowSelection.selectedRowKeys = selectedRowKeys;
            }
        }
        return table;
    }
}