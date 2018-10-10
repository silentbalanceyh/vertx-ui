import React from 'react';
import {Button} from 'antd';
import {DataLabor} from "entity";
import Ux from 'ux';

const _on2Add = (reference, record = {}) => (event) => {
    event.preventDefault();
    let {selected = []} = reference.state;
    const dataArray = DataLabor.getArray(selected);
    dataArray.saveElement(record);
    selected = Ux.clone(dataArray.to());
    reference.setState({selected});
};

const _on2Remove = (reference, record = {}) => (event) => {
    event.preventDefault();
    let {selected = []} = reference.state;
    const dataArray = DataLabor.getArray(selected);
    dataArray.removeElement(record.key);
    selected = Ux.clone(dataArray.to());
    reference.setState({selected});
};

const renderOp = (reference, from = false) => (text, record, index) => {
    if (from) {
        return record.children ? false : (<Button icon={"up"}
                                                  onClick={_on2Add(reference, record)}/>);
    } else {
        return (<Button icon={"delete"} onClick={_on2Remove(reference, record)}/>);
    }
};
const renderTo = (column = {}) => {
    if ("LABEL" !== column['$render']) {
        return (text) => {
            return (<span>{text}</span>);
        };
    } else return column.render;
};
export default {
    renderOp,
    renderTo,
};