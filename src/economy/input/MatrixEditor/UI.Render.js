import React from 'react';
import RENDER from '../_internal/UI.Render';
import {Button} from 'antd';
import Immutable from "immutable";

const onRemove = (reference, record, index) => (event) => {
    const state = reference.state;
    if (state.source) {
        const data = state.source[index];
        const {config = {}} = reference.props;
        if (config.columns && data) {
            const fields = config.columns.map(item => item.dataIndex)
                .filter(item => "key" !== item);
            fields.forEach(field => delete data[field]);
        }
        state.source[index] = data;
        const source = Immutable.fromJS(state.source).toJS();
        reference.setState({source});
        RENDER.triggerChange(reference, {source})
    } else {
        console.error("[ZERO] Remove 'data' in state has not been initialized.");
    }
};

const renderOp = (reference, config, jsx) => (text, record, index) => {
    return (
        <span>
            <Button icon={"reload"} onClick={onRemove(reference, record, index)}/>
            &nbsp;&nbsp;
            {text}
        </span>
    )
};
const renderColumn = (reference, columns = [], jsx = {}, render = {}) => {
    columns.forEach((item) => {
        if ("key" === item.dataIndex) {
            item.render = renderOp(reference, item, jsx);
        } else {
            if (render[item.dataIndex]) {
                item.render = render[item.dataIndex](reference, item, jsx)
            } else {
                const type = item['$type'] ? item['$type'] : "TEXT";
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