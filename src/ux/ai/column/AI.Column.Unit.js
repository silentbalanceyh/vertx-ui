import AiValue from "../expr/AI.Expr.Value";
import {DatePicker, Input, Select} from "antd";
import Value from "../../Ux.Value";
import AiExpr from "../expr/AI.Expr.String";
import AiPure from "../AI.Pure";
import Ai from "../input/AI.Input";
import RxAnt from '../ant/AI.RxAnt';
import Prop from '../../prop/Ux.Prop';
import React from "react";
import Xt from '../../xweb';

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
    const {viewOnly = false} = jsx;
    const params = {
        index, field: item.dataIndex
    };
    return (
        <Input {...attrs}
               readOnly={viewOnly}
               onChange={Xt.xt2ChangeUnit(reference, params)}
               value={text}/>
    )
};

const aiUnitVector = (reference, item = {}, jsx) => (text, record = {}) => {
    const config = item['$config'];
    let label = text;
    if (config && config.to) {
        label = record[config.to];
    }
    return (<span
        style={jsx.style ? jsx.style : {}}>{label}</span>)
};


const aiUnitLabel = (reference, item = {}, jsx) =>
    (text) => (<span
        style={jsx.style ? jsx.style : {}}>{text}</span>);

const aiUnitDate = (reference, item, jsx) => (text, record, index) => {
    const {value, ...meta} = jsx;
    const values = {};
    if (text) {
        values.value = Value.convertTime(text);
    }
    return (
        <DatePicker
            className={'rx-readonly'} {...meta} {...item['$config']}
            onChange={(value) => Value.valueTriggerChange(reference, {
                index, field: item.dataIndex,
                value
            })} {...values}/>
    )
};
const aiUnitDatum = (reference, item = {}, jsx = {}) => (text, record, index) => {
    const datum = item["$config"].datum;
    let options = [];
    if (datum) {
        const ref = Prop.onReference(reference, 1);
        options = RxAnt.toOptions(ref, {datum});
    }
    const unitJsx = item.jsx ? item.jsx : {};
    const value = jsx.value;
    // 赋值处理
    const attr = {};
    if (value) {
        const record = value[index];
        if (record) {
            attr.value = record[item.dataIndex];
        }
    }
    return (
        <Select
            onChange={(value) => Value.valueTriggerChange(reference, {
                index, field: item.dataIndex,
                value
            })} {...unitJsx} {...attr}>
            {options.map(item => (
                <Select.Option key={item.key}
                               value={item.value}>
                    {item.label}
                </Select.Option>
            ))}
        </Select>
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
        ...meta,
        onChange: (event) => Value.valueTriggerChange(reference, {
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
    DATUM: aiUnitDatum,
    RADIO: aiUnitRadio,
    LABEL: aiUnitLabel,
    DECIMAL: aiUnitDecimal,
    TREE: aiUnitTree
}