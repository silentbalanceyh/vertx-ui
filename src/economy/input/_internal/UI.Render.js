import React from 'react';
import {DatePicker, Input} from 'antd';
import Immutable from 'immutable';
import Ux from 'ux';

const triggerChange = (reference = {}, changedValue) => {
    const onChange = reference.props.onChange;
    if (onChange) {
        const newValue = Object.assign({}, reference.state, changedValue);
        onChange(Immutable.fromJS(newValue).toJS().source);
    }
};
const onEditDate = (reference, index, field) => (value) => {
    const {source = []} = reference.state;
    if (source[index]) {
        source[index][field] = value;
    }
    reference.setState({source: Immutable.fromJS(source).toJS()});
    triggerChange(reference, {source});
};

const onEditText = (reference, index, field) => (event) => {
    const {source = []} = reference.state;
    if (source[index]) {
        source[index][field] = event.target.value;
    }
    reference.setState({source: Immutable.fromJS(source).toJS()});
    triggerChange(reference, {source});
};
const renderDate = (reference, item, jsx) => (text, record, index) => {
    const {value, ...meta} = jsx;
    return (
        <DatePicker className={'rx-readonly'} {...meta} {...item['$config']}
                    onChange={onEditDate(reference, index, item.dataIndex)}/>
    )
};

const renderText = (reference, item = {}, jsx) => (text, record, index) => {
    const attrs = {};
    const config = item['$config'] ? item['$config'] : {};
    if (config.width) {
        attrs.style = {
            width: config.width
        }
    }
    Object.assign(attrs, config);
    const {value, ...meta} = jsx;
    console.info(attrs, item);
    return (<Input {...attrs} {...meta}
                   onChange={onEditText(reference, index, item.dataIndex)}/>)
};

const renderRadio = (reference, item = {}, jsx) => () => {
    const options = item['$config'] ? item['$config'] : [];
    return Ux.uiItemRadio(options, jsx);
};

const renderLabel = (reference, item = {}, jsx) =>
    (text) => (<span style={jsx.style ? jsx.style : {}}>{text}</span>);

const renderVector = (reference, item = {}, jsx) => (text, record = {}, index) => {
    const config = item['$config'];
    let label = text;
    if (config && config.to) {
        label = record[config.to];
    }
    return (<span style={jsx.style ? jsx.style : {}}>{label}</span>)
};

const renderDecimal = (reference, item = {}, jsx = {}) => (text, record = {}, index) => {
    const attrs = {};
    const config = item['$config'] ? item['$config'] : {};
    Object.assign(attrs, config);
    const {value, ...meta} = jsx;
    return (<Input {...attrs} {...meta}
                   onChange={onEditText(reference, index, item.dataIndex)}/>)
};
export default {
    VECTOR: Ux.aiUnitVector,
    TEXT: Ux.aiUnitText,
    DATE: Ux.aiUnitDate,
    RADIO: Ux.aiUnitRadio,
    LABEL: Ux.aiUnitLabel,
    DECIMAL: Ux.aiUnitDecimal,
    triggerChange
};