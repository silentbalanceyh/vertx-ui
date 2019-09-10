import React from "react";
import Ux from "ux";
import {Input, Select} from "antd";

import Raft from '../raft';
import Datum from '../datum';
import R from '../expression';

const aiStateInput = (reference, column) => () => {
    let {rowRecord = {}} = reference.state;
    rowRecord = Ux.clone(rowRecord);
    return (
        <Input
            value={
                rowRecord[column.dataIndex] ? rowRecord[column.dataIndex] : ""
            }
            onChange={event => {
                event.preventDefault();
                rowRecord[column.dataIndex] = event.target.value;
                reference.setState({rowRecord});
            }}
        />
    );
};

const aiStateDecimal = (reference, column = {}) => () => {
    const attrs = R.applyDynamic(column);
    const {$config = {}} = column;
    attrs.addonAfter = $config.unit ? $config.unit : "￥";
    let {rowRecord = {}} = reference.state;
    rowRecord = Ux.clone(rowRecord);
    return (
        <Input
            value={
                rowRecord[column.dataIndex] ? rowRecord[column.dataIndex] : ""
            }
            onChange={event => {
                event.preventDefault();
                const value = Raft.Normalizer.decimal(18, 2)(
                    event.target.value
                );
                rowRecord[column.dataIndex] = value;
                reference.setState({rowRecord});
            }}
            {...attrs}
        />
    );
};

const aiStateDatum = (reference, column = {}) => {
    const attrs = R.applyDynamic(column);
    const {$datum = {}} = column;
    let items = [];
    if ($datum) {
        const ref = Datum.onReference(reference, 1);
        items = R.Ant.toOptions(ref, {datum: $datum});
    }
    return (
        <Select {...attrs}>
            {items.map(item => (
                <Select.Option
                    key={item.key}
                    style={item.style ? item.style : {}}
                    value={item.hasOwnProperty("value") ? item.value : item.key}
                >
                    {item.name || item.label}
                </Select.Option>
            ))}
        </Select>
    );
};

export default {
    TEXT: aiStateInput,
    DECIMAL: aiStateDecimal,
    DATUM: aiStateDatum
};
