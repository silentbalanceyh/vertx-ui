import React from 'react';
import {Button} from 'antd';
import {DataLabor} from "entity";
import Ux from 'ux';

const _on2Add = (reference, record = {}) => (event) => {
    event.preventDefault();
    let {
        selected = [], // 直接选中项
        shared = [], // 未选中的共享项
        config = {}, // 树形配置
        _data // 原始数据
    } = reference.state;
    const treeData = config.tree;
    const recordArray = Ux.elementBranch(_data, record[treeData.key],
        treeData.field, treeData.key);

    // 计算分支上的数据
    const dataArray = DataLabor.getArray(selected);
    recordArray.filter(each => each[treeData.key] === record[treeData.key])
        .forEach(each => dataArray.saveElement(each));
    selected = Ux.clone(dataArray.to());

    // 设置共享数据项
    const sharedArray = DataLabor.getArray(shared);
    recordArray.filter(each => each[treeData.key] !== record[treeData.key])
        .forEach(each => sharedArray.saveElement(each));
    shared = Ux.clone(sharedArray.to());
    // 设置共享节处理
    reference.setState({selected, shared});
    Ux.xtChange(reference, selected.concat(shared), true);
};

const _on2Remove = (reference, record = {}) => (event) => {
    event.preventDefault();
    let {
        selected = [], // 直接选中项
        shared = [], // 未选中的共享项
        config = {}, // 树形配置
        _data // 原始数据
    } = reference.state;
    const treeData = config.tree;
    const children = Ux.elementChildren(_data, record[treeData.key],
        treeData.field, treeData.key);

    const dataArray = DataLabor.getArray(selected);
    children.forEach(each => dataArray.removeElement(each[treeData.key], treeData.key));
    selected = Ux.clone(dataArray.to());

    const sharedArray = DataLabor.getArray(shared);
    children.forEach(each => sharedArray.removeElement(each[treeData.key], treeData.key));
    shared = Ux.clone(sharedArray.to());

    reference.setState({selected, shared});
    Ux.xtChange(reference, selected.concat(shared), true);
};

const renderOp = (reference, from = false, column = {}) => (text, record) => {
    let label = "";
    if (column.display) {
        label = record[column.display];
    }
    if (from) {
        return (
            <span>
                {label}&nbsp;&nbsp;
                {record.children ? false :
                    (<Button icon={"up"} shape={"circle"} size={"small"}
                             onClick={_on2Add(reference, record)}/>)}
            </span>
        );
    } else {
        return (
            <span>
                {label}&nbsp;&nbsp;
                <Button icon={"delete"} shape={"circle"} size={"small"}
                        onClick={_on2Remove(reference, record)}/>
            </span>
        );
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