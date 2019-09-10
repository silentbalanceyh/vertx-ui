import U from "underscore";
import {Button} from "antd";
import React from "react";

import Ele from '../element';
import Abs from '../abyss';
import E from '../error';
import Ut from '../unity';
import Eng from '../engine';

const _jetAdd = (reference, index, key, defaultRecord = {}) => (event) => {
    event.preventDefault();
    let {dataSource = {}} = reference.state;
    const current = dataSource[key];
    if (current) {
        const item = current;
        const record = Object.assign({key: Ut.randomUUID()}, defaultRecord);
        if (index === item.length) {
            item.push(record);
        } else {
            item.splice(index + 1, 0, record);
        }
        dataSource[key] = item;
        dataSource = Abs.clone(dataSource);
        reference.setState({dataSource});
        Ele.valueOnChange(reference, {dataSource});
    }
};
const _jetRemove = (reference, index, key) => (event) => {
    event.preventDefault();
    let {dataSource = {}} = reference.state;
    const current = dataSource[key];
    if (current) {
        const item = current.filter((item, idx) => idx !== index);
        dataSource[key] = item;
        dataSource = Abs.clone(dataSource);
        reference.setState({dataSource});
        Ele.valueOnChange(reference, {dataSource});
    }
};
const _jetOp = (reference, item, jsx) => (text, record, index) => {
    return (
        <Button.Group style={{minWidth: "64px"}}>
            <Button icon={"plus"}
                    onClick={_jetAdd(reference, index, item.sequence, jsx.defaultValue)}/>
            <Button disabled={0 === index} icon={"minus"}
                    onClick={_jetRemove(reference, index, item.sequence)}/>
        </Button.Group>
    );
};

const xtColumn = (reference, columns = [], jsx, render = {}, key) => {
    columns = Eng.aiExprColumn(columns);
    columns.forEach(item => {
        // 赋值
        item.sequence = key;
        if ("key" === item.dataIndex) {
            if (render.hasOwnProperty('key') && U.isFunction(render['key'])) {
                const fnRender = render['key'];
                item.render = fnRender(reference, item, jsx);
            } else {
                item.render = _jetOp(reference, item, jsx);
            }
        } else {
            let fnRender = render[item.dataIndex];
            if (!fnRender) {
                const type = item["$render"] ? item["$render"] : "TEXT";
                // 特殊的Render
                const RENDER = Eng.Column.Dynamic;
                fnRender = RENDER[type];
                E.fxTerminal(!fnRender, 10083, item.dataIndex, fnRender);
            }
            item.render = fnRender(reference, item, jsx);
        }
    });
    return columns;
};

export default {
    xtColumn
};