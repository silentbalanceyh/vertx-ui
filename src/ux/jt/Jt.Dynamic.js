import Ai from "../ai/AI";
import E from "../Ux.Error";
import Random from "../Ux.Random";
import U from "underscore";
import {Button} from "antd";
import React from "react";
import Immutable from "immutable";
import Value from "../Ux.Value";

const _jetAdd = (reference, index, key, defaultRecord = {}) => (event) => {
    event.preventDefault();
    let {dataSource = {}} = reference.state;
    const current = dataSource[key];
    if (current) {
        const item = current;
        const record = Object.assign({key: Random.randomUUID()}, defaultRecord);
        if (index === item.length) {
            item.push(record);
        } else {
            item.splice(index + 1, 0, record);
        }
        dataSource[key] = item;
        dataSource = Immutable.fromJS(dataSource).toJS();
        reference.setState({dataSource});
        Value.valueOnChange(reference, {dataSource});
    }
};
const _jetRemove = (reference, index, key) => (event) => {
    event.preventDefault();
    let {dataSource = {}} = reference.state;
    const current = dataSource[key];
    if (current) {
        const item = current.filter((item, idx) => idx !== index);
        dataSource[key] = item;
        dataSource = Immutable.fromJS(dataSource).toJS();
        reference.setState({dataSource});
        Value.valueOnChange(reference, {dataSource});
    }
};
const _jetOp = (reference, item, jsx) => (text, record, index) => {
    return (
        <Button.Group style={{minWidth: "64px"}}>
            <Button icon={"plus"} onClick={_jetAdd(reference, index, item.sequence, jsx.defaultValue)}/>
            <Button disabled={0 === index} icon={"minus"} onClick={_jetRemove(reference, index, item.sequence)}/>
        </Button.Group>
    )
};

const jdcColumn = (reference, columns = [], jsx, render = {}, key) => {
    columns = Ai.aiExprColumn(columns);
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
                const RENDER = Ai.aiDynamicRenders;
                fnRender = RENDER[type];
                E.fxTerminal(!fnRender, 10083, item.dataIndex, fnRender);
            }
            item.render = fnRender(reference, item, jsx);
        }
    });
    return columns;
};
// 初始化
const jdcInit = (reference, returnState = false) => {
    E.fxTerminal(!reference, 10049, reference);
    const {source = []} = reference.props;
    const keys = source.map(item => item.key);
    const state = {};
    keys.forEach(key => state[key] = [
        {key: Random.randomUUID()},
        {key: Random.randomUUID()}
    ]);
    if (returnState) {
        return {dataSource: state};
    } else {
        reference.setState({dataSource: state});
    }
};
// Js Dynamic Column
export default {
    jdcInit,
    jdcColumn
}