import Ux from 'ux';
import React from 'react';
import {Button, Table, Tag} from 'antd';
import './Cab.less';
import Ex from "ex";
import Events from "./Op";

const renderSelection = (reference) => {
    const {$batch = false} = reference.props;
    if ($batch) {
        /*
         * 批量才开启选择，如果没有批量则不需要选择操作
         */
        const {$selected = []} = reference.props;
        return {
            onChange: ($selected = []) => {
                const {$data = {}} = reference.state;
                /*
                 * 追加第二参
                 */
                const dataArray = Ux.isArray($data.list) ? $data.list : [];
                const $selectedKeys = Ux.immutable($selected);
                Ex.rx(reference).selected($selected,
                    dataArray.filter(item => $selectedKeys.contains(item.key)));
            },
            /* 受控处理（用于设置受控的情况）*/
            selectedRowKeys: $selected,
            /* 行特殊控制（是否可选择） */
            getCheckboxProps: (record = {}) => Ux.pluginSelection(reference, record)
        }
    }
}

const renderTotal = ({selected, selectJsx, reportJsx}) => (
    <span>
        {selected ? (
            <Tag color={"magenta"}>
                {selectJsx}
            </Tag>
        ) : false}
        {reportJsx}
    </span>
)
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
    const {$projection = []} = reference.state;
    if (0 < $projection.length) {
        const filtered = Ux.immutable($projection);
        resultColumns = resultColumns.filter(column => !filtered.contains(column.dataIndex));
    }
    /*
     * 核心处理 Action 节点
     */
    const executor = Ux.configExecutor(reference, Events);
    resultColumns = Ux.configColumn(reference, resultColumns, executor);
    return resultColumns;
};

const _initTotal = (reference) => (total) => {
    const {$table = {}} = reference.state;
    if ($table.total) {
        const {$selected = []} = reference.props;
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
        return renderTotal({selected, reportJsx, selectJsx});
    }
    return false;
};

const renderPager = (reference, data = {}) => {
    const {$query = {}} = reference.state;
    const {pager = {}} = $query;
    return {
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: [
            '10', '20', '50', '100'
        ],

        size: "small",
        // 解决多个列表切换的问题
        current: pager.page,
        pageSize: pager.size,

        total: data.count,
        showTotal: _initTotal(reference)
    };
}
export default {
    renderColumn,
    renderPager,
    renderSelection,
    renderContent: (reference, {
        table = {},
        data = []
    }) => Ux.isEmpty(table) ? false : (
        <div>
            <Table {...table} dataSource={data}/>
            {/* 按钮操作用于刷新 Refresh 处理，重新加载列表 */}
            <Button id={"__BTN_REFRESH"} className={"ux-hidden"}
                    onClick={event => {
                        /*
                         * Dirty Refresh 按钮，外层专用
                         */
                        Ux.prevent(event);
                        /*
                         * $dirty 和 $loading 必须同时，否则无法生效
                         */
                        reference.setState({$dirty: true, $loading: true});
                    }}/>
        </div>
    )
}