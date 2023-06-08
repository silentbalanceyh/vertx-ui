import Ux from "ux";
import {Tag} from "antd";
import React from "react";
import EVENT from "./ego.__.v.kin.event.names";
import __Zn from './zero.module.dependency';

const __renderTotal = (reference) => (total) => {
    const {$table = {}} = reference.state;
    if ($table.total) {
        const {$selected = []} = reference.state;
        const {$query = {}} = reference.state;
        const {pager = {}} = $query;
        /*
         * 除尽的情况
         */
        let page = 0;
        if (0 === total % pager.size) {
            page = Ux.valueInt(total / pager.size);
        } else {
            page = Ux.valueInt(total / pager.size) + 1;
        }
        const {report, selected} = $table.total;
        const reportJsx = Ux.formatExpr(report, {total, page});
        const selectJsx = Ux.formatExpr(selected, {count: $selected.length});
        return (
            <span>
                {selected ? (
                    <Tag color={"magenta"}>
                        {selectJsx}
                    </Tag>
                ) : false}
                {reportJsx}
            </span>
        );
    }
    return false;
}
const renderPager = (reference, data = {}) => {
    const {$query = {}} = reference.state;
    const {pager = {}} = $query;
    return {
        showSizeChanger: true,
        showQuickJumper: true,

        position: ["bottomCenter"],
        // 解决多个列表切换的问题
        current: pager.page,
        pageSize: pager.size,

        total: data.count,
        showTotal: __renderTotal(reference)
    };
}
const __isBatchEnabled = (reference) => {
    const {op = {}} = reference.state;
    let counter = 0;
    Object.keys(op).forEach(opKey => {
        if (opKey.startsWith('op.batch')) {
            counter += 1;
        } else if (opKey.startsWith("op.extension")) {
            const button = op[opKey];
            const region = button.region ? button.region : "";
            if (region.startsWith("op.batch")) {
                // Skip the config component
                if (button.component) {
                    if (!["RADIO"].includes(button.component)) {
                        counter += 1;
                    }
                } else {
                    counter += 1;
                }
            }
        }
    });
    return 0 < counter;
};
const renderSelection = (reference) => {
    if (__isBatchEnabled(reference)) {
        /*
         * 批量才开启选择，如果没有批量则不需要选择操作
         */
        const {$selected = []} = reference.state;
        return {
            onChange: ($selected = []) => {
                const {$data = {}} = reference.state;
                const dataArray = Ux.valueArray($data)
                    .filter(item => $selected.includes(item.key));
                /*
                 * rxPostSelected调用
                 */
                const rxSelected = __Zn.rxSelected(reference);
                rxSelected($selected, dataArray);
            },
            /* 受控处理（用于设置受控的情况）*/
            selectedRowKeys: $selected,
            /* 行特殊控制（是否可选择） */
            getCheckboxProps: (record = {}) => Ux.pluginSelection(reference, record)
        }
    }
}

const renderColumn = (reference, columns = []) => {
    const source = Ux.clone(columns);
    /*
     * 先处理配置
     */
    let resultColumns = [];
    source.forEach(column => {
        const normalized = Ux.valueLadder(column);
        resultColumns.push(normalized);
    });
    /*
     * 先使用 projection 过滤
     */
    // const {$projection = []} = reference.state;
    // resultColumns = resultColumns.filter(column => !$projection.includes(column.dataIndex));
    const executor = Ux.configExecutor(reference, EVENT);
    resultColumns = Ux.configColumn(reference, resultColumns, executor);
    return resultColumns;
};
export default {
    renderPager,
    renderSelection,
    renderColumn,
}