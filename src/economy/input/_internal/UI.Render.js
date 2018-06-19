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
    const {value, ...meta} = jsx;
    return (<Input size={"small"} {...attrs} {...meta}
                   onChange={onEditText(reference, index, item.dataIndex)}/>)
};

const renderRadio = (reference, item = {}, jsx) => (text, record, index) => {
    const options = item['$config'] ? item['$config'] : [];
    return Ux.uiItemRadio(options, jsx);
};

export default {
    TEXT: renderText,
    DATE: renderDate,
    RADIO: renderRadio,
    triggerChange
};