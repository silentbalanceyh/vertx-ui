import React from 'react';
import {Button} from 'antd';
import Ux from 'ux';

const _on2Click = (reference, record) => (event) => {
    event.preventDefault();
    let {data = []} = reference.state;
    data.forEach((dataItem, index) => {
        if (dataItem.key === record.key) {
            const updated = {};
            updated.label = record.label;
            updated.key = record.key;
            data[index] = updated;
        }
    });
    data = Ux.clone(data);
    reference.setState({data});
    Ux.xtChange(reference, data, true);
};

const _renderOp = (reference, record, text) => {
    const disabled = reference.props.readOnly;
    return (
        <span>
            <Button icon={"undo"} shape={"circle"}
                    disabled={disabled}
                    onClick={_on2Click(reference, record)}/>
            &nbsp;&nbsp;
            {text}
        </span>
    );
};
const renderOp = (reference) => (text = {}, record = {}) => {
    // 是否包含了colSpan属性
    const obj = {};
    // 最终的Object
    if ("string" === typeof text) {
        return _renderOp(reference, record, text);
    } else {
        const {colSpan, className = ""} = text;
        if (undefined !== colSpan) {
            obj.props = {colSpan};
        } else {
            obj.props = {colSpan: 1};
        }
        obj.children = (
            <span className={className}>
                {_renderOp(reference, record, text.children)}
            </span>
        );
    }
    return obj;
};
export default {
    renderOp
};