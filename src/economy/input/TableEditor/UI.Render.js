import React from 'react';
import {Button, DatePicker, Input} from 'antd';
import Ux from 'ux';
import Immutable from 'immutable';

const triggerChange = (reference = {}, changedValue) => {
    const onChange = reference.props.onChange;
    if (onChange) {
        const newValue = Object.assign({}, reference.state, changedValue);
        onChange(Immutable.fromJS(newValue).toJS().source);
    }
};

const onAdd = (reference, index) => (event) => {
    const state = reference.state;
    if (state.source) {
        const item = state.source;
        if (index === item.length) {
            item.push({key: Ux.randomUUID()});
        } else {
            item.splice(index + 1, 0, {key: Ux.randomUUID()});
        }
        reference.setState({
            source: Immutable.fromJS(item).toJS()
        });
    } else {
        console.error("[ZERO] Add 'data' in state has not been initialized.");
    }
};

const onRemove = (reference, index) => (event) => {
    const state = reference.state;
    if (state.source) {
        const item = state.source.filter((item, idx) => idx !== index);
        reference.setState({
            source: Immutable.fromJS(item).toJS()
        });
    } else {
        console.error("[ZERO] Remove 'data' in state has not been initialized.");
    }
};

const renderOp = (reference, config, jsx) => (text, record, index) => {
    return (
        <span>
            <Button.Group style={{width: 80, textAlign: "center"}}>
                <Button icon={"plus"} onClick={onAdd(reference, index)}/>
                <Button disabled={0 === index} icon={"minus"} onClick={onRemove(reference, index)}/>
            </Button.Group>
        </span>
    )
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

const RENDER = {
    TEXT: renderText,
    DATE: renderDate
};
const renderColumn = (reference, columns = [], jsx) => {
    columns.forEach((item) => {
        if ("key" === item.dataIndex) {
            item.render = renderOp(reference, item);
        } else {
            const type = item['$type'] ? item['$type'] : "TEXT";
            console.info(type);
            const render = RENDER[type];
            if (render) {
                item.render = render(reference, item, jsx)
            }
        }
    })
};
export default {
    renderColumn
}