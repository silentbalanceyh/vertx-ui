import Ux from 'ux';
import U from 'underscore';
import {Tag} from 'antd';
import React from 'react';
import Fx from '../Fx';

const initSelection = (reference) => {
    return {
        onChange: ($selected = []) => {
            const {fnSelect} = reference.props;
            if (U.isFunction(fnSelect)) {
                fnSelect($selected);
            }
        }
    };
};
const initTotal = (reference) => (total) => {
    const {$table = {}} = reference.props;
    if ($table.total) {
        const {$query = {}, $selected = []} = reference.props;
        const {pager = {}} = $query;
        const page = Ux.valueInt(total / pager.size) + 1;
        const {report, selected} = $table.total;
        const reportJsx = Ux.formatExpr(report, {total, page});
        return (
            <span>
                {selected ? (
                    <Tag color={"magenta"}>
                        {Ux.formatExpr(selected, {count: $selected.length})}
                    </Tag>
                ) : false}
                {reportJsx}
            </span>
        );
    } else return false;
};
const initPager = (reference = {}) => {
    const {$query = {}} = reference.props;
    const {data = {}} = reference.state;
    const {pager = {}} = $query;
    return {
        showSizeChanger: true,
        showQuickJumper: true,

        size: "small",
        pageSize: pager.size,

        total: data.count,
        showTotal: initTotal(reference)
    };
};
const initRow = (reference = {}, row = {}) => (record) => {
    const result = {};
    Ux.itObject(row, (eventName, target) => {
        const fun = Fx[target];
        if (U.isFunction(fun)) {
            result[eventName] = event => {
                event.preventDefault();
                fun(reference, record.key);
            };
        }
    });
    return result;
};
export default {
    initSelection,
    initPager,
    initRow,
};