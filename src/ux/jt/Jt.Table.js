import E from '../Ux.Error'
import Random from '../Ux.Random'
import Ai from '../ai/AI'
import React from 'react'
import {Button} from 'antd';
import Immutable from "immutable";
import U from "underscore";
import Value from '../Ux.Value'

const _jetAdd = (reference, index) => (event) => {
    event.preventDefault();
    const state = reference.state;
    E.fxTerminal(!state.source, 10052, state.source);
    if (state.source) {
        const item = state.source;
        if (index === item.length) {
            item.push({key: Random.randomUUID()});
        } else {
            item.splice(index + 1, 0, {key: Random.randomUUID()});
        }
        const source = Immutable.fromJS(state.source).toJS();
        reference.setState({source});
        Value.valueOnChange(reference, {source})
    }
};

const _jetRemove = (reference, index) => (event) => {
    event.preventDefault();
    const state = reference.state;
    E.fxTerminal(!state.source, 10052, state.source);
    if (state.source) {
        const item = state.source.filter((item, idx) => idx !== index);
        const source = Immutable.fromJS(item).toJS();
        reference.setState({source});
        Value.valueOnChange(reference, {source})
    }
};
const _jetOp = (reference, item, jsx) => (text, record, index) => {
    return (
        <Button.Group style={{minWidth: "64px"}}>
            <Button icon={"plus"} onClick={_jetAdd(reference, index)}/>
            <Button disabled={0 === index} icon={"minus"} onClick={_jetRemove(reference, index)}/>
        </Button.Group>
    )
};

const jctColumn = (reference, columns = [], jsx, render = {}) => {
    columns = Ai.aiExprColumn(columns);
    columns.forEach(item => {
        if ("key" === item.dataIndex) {
            item.render = _jetOp(reference, item, jsx);
        } else {
            let fnRender = render[item.dataIndex];
            if (!fnRender) {
                const type = item["$render"] ? item["$render"] : "TEXT";
                const RENDER = Ai.aiUnitRenders;
                fnRender = RENDER[type];
                E.fxTerminal(!fnRender, 10083, item.dataIndex, fnRender);
            }
            item.render = fnRender(reference, item, jsx);
        }
    });
    return columns;
};

const jetInit = (reference, returnState = false) => {
    E.fxTerminal(!reference, 10049, reference);
    const props = reference.props;
    const source = props.value || [{key: Random.randomUUID()}];
    if (returnState) {
        return {source};
    } else {
        reference.setState({source})
    }
};

const IGNORE_KEYS = Immutable.fromJS(["reference", "fnOut"]);
const jctProps = (reference) => {
    E.fxTerminal(!reference, 10049, reference);
    const result = {};
    Object.keys(reference.props).filter(key => !IGNORE_KEYS.contains(key))
        .forEach(item => result[item] = reference.props[item]);
    return result;
};
const jctData = (reference) => {
    E.fxTerminal(!reference, 10049, reference);
    E.fxTerminal(!reference.state, 10084, reference.state);
    let {source} = reference.state;
    if (U.isArray(source)) {
        source.forEach((item, index) => (item.sequence = (index + 1)))
    } else {
        source = [];
    }
    return source;
};
// jet -- Js Editor Table
export default {
    // 初始化数据
    jetInit,
    // 渲染Op
    jctColumn,
    // 数据处理
    jctData,
    // 属性抽取
    jctProps,
}