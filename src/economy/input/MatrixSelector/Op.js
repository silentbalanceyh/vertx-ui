import yi from './yi';
import Ux from "ux";
import Ix from "../../_internal/ix";
import React from 'react';
import {Button} from 'antd';

export default {
    ...yi,
    yoValue: (reference, jsx = {}) => {
        const inputAttrs = Ux.valueLimit(jsx);
        if (undefined === inputAttrs.value) {
            /*
             * 只有 undefined 的时候触发
             */
            const {$defaultValue} = reference.state;
            if ($defaultValue) {
                inputAttrs.value = $defaultValue;
            }
        }
        return inputAttrs;
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
            )
        }
        $columns.push(action);

        table.columns.forEach(column => $columns.push(column));
        $tableTarget.columns = $columns;
        return $tableTarget;
    },
    yoPager: Ix.tablePager,
}