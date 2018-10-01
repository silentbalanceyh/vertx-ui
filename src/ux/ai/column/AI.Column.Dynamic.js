import React from "react";
import {Icon, Input} from "antd";
import Value from "../../Ux.Value";
import AiValue from '../expr/AI.Expr.Value';
import U from 'underscore';

const aiDynamicEpsilon = (reference, item = {}, jsx) => (text) => {
    const config = item["$config"];
    let label = config[text];
    return (<span style={jsx.style ? jsx.style : {}}>{label}</span>)
};

const aiDynamicState = (reference, item = {}, jsx) => (text, record, index) => {
    let {fnHoc, fnItem, ...rest} = jsx;
    const onClick = event => {
        event.preventDefault();
        const state = {};
        state["$dialog"] = {};
        state["$dialog"]["key"] = item.sequence;
        state["$dialog"]["index"] = index;
        state["$dialog"]["data"] = record;
        if (U.isFunction(fnHoc)) {
            fnHoc(state, record);
        } else {
            reference.setState(state);
        }
    };
    if (fnItem) {
        rest = fnItem(item, rest, record);
    }
    return (
        <Input className="rx-readonly" readOnly onClick={onClick} suffix={
            <Icon type={"search"} onClick={onClick}/>
        } {...rest} value={text}/>
    );
};

const applyHoc = (item = {}) => {
    const hoc = {};
    Object.keys(item).filter(key => "fnHoc" !== key && "fnItem" !== key)
        .forEach(each => hoc[each] = item[each]);
    return hoc;
};

const aiDynamicText = (reference, item = {}, jsx = {}) => (text, record = {}, index) => {
    const attrs = AiValue.applyDynamic(item);
    const filtered = applyHoc(jsx);
    const {value, viewOnly = false, ...meta} = filtered;
    return (
        <Input {...attrs} {...meta}
               readOnly={viewOnly}
               onChange={(event) => Value.valueDynamicChange(reference, {
                   index, field: item.dataIndex,
                   value: event.target.value, sequence: item.sequence
               })} value={text}/>
    )
};
export default {
    EPSILON: aiDynamicEpsilon,
    STATE: aiDynamicState,
    TEXT: aiDynamicText,
}