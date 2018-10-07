import AiValue from "../expr/AI.Expr.Value";
import React from "react";
import Ux from "ux";
import {Input, Select} from "antd";
import Norm from "../../Ux.Normalize";
import Prop from "../../prop/Ux.Prop";
import RxAnt from "../ant/AI.RxAnt";

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
    const attrs = AiValue.applyDynamic(column);
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
                const value = Norm.normalizer.decimal(18, 2)(
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
    const attrs = AiValue.applyDynamic(column);
    const {$datum = {}} = column;
    let items = [];
    if ($datum) {
        const ref = Prop.onReference(reference, 1);
        items = RxAnt.toOptions(ref, {datum: $datum});
    }
    //let { rowRecord = {} } = reference.state;
    //rowRecord = Ux.clone(rowRecord);
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
