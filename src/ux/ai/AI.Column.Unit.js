import AiValue from "./AI.Expr.Value";
import {DatePicker, Input} from "antd";
import Value from "../Ux.Value";
import AiExpr from "./AI.Expr.String";
import AiPure from "./AI.Pure";
import Ai from "./AI.Input";
import React from "react";

const aiUnitDecimal = (reference, item = {}, jsx = {}) => (text, record = {}, index) => {
    const attrs = AiValue.applyDynamic(item);
    const {value, ...meta} = jsx;
    return (
        <Input {...attrs} {...meta}
               onChange={(event) => Value.valueTriggerChange(reference, {
                   index, field: item.dataIndex,
                   value: event.target.value
               })}/>
    )
};

const aiUnitText = (reference, item = {}, jsx = {}) => (text, record = {}, index) => {
    const attrs = AiValue.applyDynamic(item);
    const {value, viewOnly = false, ...meta} = jsx;
    return (
        <Input {...attrs} {...meta}
               readOnly={viewOnly}
               onChange={(event) => Value.valueTriggerChange(reference, {
                   index, field: item.dataIndex,
                   value: event.target.value
               })} value={text}/>
    )
};

const aiUnitVector = (reference, item = {}, jsx) => (text, record = {}) => {
    const config = item['$config'];
    let label = text;
    if (config && config.to) {
        label = record[config.to];
    }
    return (<span style={jsx.style ? jsx.style : {}}>{label}</span>)
};


const aiUnitLabel = (reference, item = {}, jsx) =>
    (text) => (<span style={jsx.style ? jsx.style : {}}>{text}</span>);

const aiUnitDate = (reference, item, jsx) => (text, record, index) => {
    const {value, ...meta} = jsx;
    return (
        <DatePicker className={'rx-readonly'} {...meta} {...item['$config']}
                    onChange={(value) => Value.valueTriggerChange(reference, {
                        index, field: item.dataIndex,
                        value
                    })} value={Value.convertTime(text)}/>
    )
};

const aiUnitRadio = (reference, item = {}, jsx = {}) => (text, record, index) => {
    let options = item['$config'] ? item['$config'] : [];
    const {value, ...meta} = jsx;
    const items = AiExpr.aiExprOption(options.items);
    meta.value = text;
    if (meta.viewOnly) {
        meta.disabled = meta.viewOnly;
        meta.className = "web-radio-view";
    }
    return AiPure.aiInputRadios(items, {
        ...meta, onChange: (event) => Value.valueTriggerChange(reference, {
            index, field: item.dataIndex,
            value: event.target.value
        })
    })
};

const aiUnitTree = (reference, item = {}, jsx = {}) => () => {
    const {value, onChange, ...meta} = jsx;
    return Ai.aiTreeSelect(reference.props.reference, {
        config: item['$config'],
        ...meta
    }, onChange);
};

export default {
    VECTOR: aiUnitVector,
    TEXT: aiUnitText,
    DATE: aiUnitDate,
    RADIO: aiUnitRadio,
    LABEL: aiUnitLabel,
    DECIMAL: aiUnitDecimal,
    TREE: aiUnitTree
}