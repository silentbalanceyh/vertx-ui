import React from 'react';
import {Button} from 'antd';
import {DataLabor} from "entity";
import Ux from 'ux';

const _findParent = (reference, record) => {
    const {_data = [], config = {}} = reference.state;
    const treeData = config.tree;
    return Ux.elementBranch(_data, record[treeData.key],
        treeData.field, treeData.key);
};

const _on2Add = (reference, record = {}) => (event) => {
    event.preventDefault();
    let {selected = [], shared = [], config = {}} = reference.state;
    const treeData = config.tree;
    const dataArray = DataLabor.getArray(selected);
    const sharedArray = DataLabor.getArray(shared);
    const recordArray = _findParent(reference, record);
    recordArray.filter(each => each[treeData.key] === record[treeData.key])
        .forEach(each => dataArray.saveElement(each));
    recordArray.filter(each => each[treeData.key] !== record[treeData.key])
        .forEach(each => sharedArray.saveElement(each));
    // 设置共享节处理
    selected = Ux.clone(dataArray.to());
    shared = Ux.clone(sharedArray.to());
    reference.setState({selected, shared});
};

const _on2Remove = (reference, record = {}) => (event) => {
    event.preventDefault();
    let {selected = []} = reference.state;
    const dataArray = DataLabor.getArray(selected);
    dataArray.removeElement(record.key);
    selected = Ux.clone(dataArray.to());
    reference.setState({selected});
};

const renderOp = (reference, from = false) => (text, record) => {
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