import Ux from "ux";
import Ix from "../../_internal/ix";
import React from 'react';
import {Button, Popconfirm} from 'antd';

export default {
    yiDefault: (reference = {}) => {
        const {config = {}} = reference.props;
        /*
         * 各部分组件配置处理
         */
        const dialog = Ix.dialogConfig(reference, config);
        const onClick = Ix.dialogClick(reference, config);

        // 通用表格方法
        const table = Ix.tableConfig(reference, config);

        const search = Ix.searchConfig(reference, config);
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
    yoValue: (reference, jsx = {}) => {
        const table = {};
        const {value = []} = reference.props;
        table.dataSource = value;
        return table;
    },
    yoTarget: (reference, table = {}) => {
        const $tableTarget = Ux.clone(table);
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
            className: "web-table-title-op",
            title: (
                <Button icon={"plus"} className={"ux-spec"}
                        onClick={onClick}>
                    {dynamic.title}
                </Button>
            ),
            render: (text, record) => {
                const {config = {}} = dynamic;
                return (
                    <div>
                        <Popconfirm title={config.confirm} onConfirm={event => {
                            Ux.prevent(event);
                            // 读取原始数据
                            const {value = []} = reference.props;
                            let $values = Ux.clone(value);
                            $values = $values.filter(item => record.key !== item.key);
                            Ux.fn(reference).onChange($values);
                        }}>
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
    yoPager: Ix.tablePager,
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