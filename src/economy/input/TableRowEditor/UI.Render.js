import React from 'react';
import {Button} from 'antd';
import Ux from 'ux';
import Immutable from 'immutable';

const onAdd = (reference, index) => (event) => {
    const state = reference.state;
    Ux.E.fxTerminal(!state.source, 10052, state.source);
    if (state.source) {
        const item = state.source;
        if (index === item.length) {
            item.push({key: Ux.randomUUID()});
        } else {
            item.splice(index + 1, 0, {key: Ux.randomUUID()});
        }
        const source = Immutable.fromJS(state.source).toJS();
        reference.setState({source});
        Ux.valueOnChange(reference, {source})
    }
};

const onRemove = (reference, index) => (event) => {
    const state = reference.state;
    Ux.E.fxTerminal(!state.source, 10052, state.source);
    if (state.source) {
        const item = state.source.filter((item, idx) => idx !== index);
        const source = Immutable.fromJS(item).toJS();
        reference.setState({source});
        Ux.valueOnChange(reference, {source})
    }
};

const renderOp = (reference, config, jsx) => (text, record, index) => {
    return (
        <span>
            <Button.Group style={{minWidth: "64px"}}>
                <Button icon={"plus"} onClick={onAdd(reference, index)}/>
                <Button disabled={0 === index} icon={"minus"} onClick={onRemove(reference, index)}/>
            </Button.Group>
        </span>
    )
};
const renderColumn = (reference, columns = [], jsx, render = {}) => {
    columns.forEach((item) => {
        if ("key" === item.dataIndex) {
            item.render = renderOp(reference, item);
        } else {
            if (render[item.dataIndex]) {
                item.render = render[item.dataIndex]
            } else {
                const type = item['$type'] ? item['$type'] : "TEXT";
                const RENDER = Ux.aiUnitRenders;
                const render = RENDER[type];
                if (render) {
                    item.render = render(reference, item, jsx)
                }
            }
        }
    })
};
export default {
    renderColumn
}