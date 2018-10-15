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
const renderOp = (reference) => (text, record) => {
    return (
        <span>
            <Button icon={"undo"} shape={"circle"}
                    onClick={_on2Click(reference, record)}/>
            &nbsp;&nbsp;
            {text}
        </span>
    );
};

export default {
    renderOp
};