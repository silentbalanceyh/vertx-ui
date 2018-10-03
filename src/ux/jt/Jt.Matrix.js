import E from "../Ux.Error";
import Ux from "ux";
import Immutable from "immutable";
import {Button} from "antd";
import React from "react";
import JtTable from './Jt.Table';

const _jemRemove = (reference, record, index) => (event) => {
    const state = reference.state;
    Ux.E.fxTerminal(!state.source, 10052, state.source);
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
        Ux.valueOnChange(reference, {source});
    }
};

const _jemOp = (reference, config, jsx = {}) => (text, record, index) => {
    return (
        <span>
            {jsx.refresh ? (<Button icon={"reload"}
                                    onClick={_jemRemove(reference, record, index)}/>) : false}
            &nbsp;&nbsp;
            {text}
        </span>
    );
};
const jemInit = (reference, config = {}, returnState = false) => {
    E.fxTerminal(!reference, 10049, reference);
    const props = reference.props;
    let source = [];
    if (props.value) {
        source = props.value;
    } else {
        const {rows = {}} = config;
        const dataRow = Object.keys(rows);
        dataRow.forEach(row => {
            const dataItem = {};
            dataItem.key = rows[row];
            dataItem.field = row;
            source.push(dataItem);
        });
    }
    if (returnState) {
        return source;
    } else {
        reference.setState({source});
    }
};

const jemColumn = (reference, columns = [], jsx, render = {}) => JtTable.jctColumn(reference, columns, jsx, {
    ...render,
    key: _jemOp
});
// jem -- Js Editor Matrix
export default {
    // 初始化数据
    jemInit,
    // 渲染Op
    jemColumn,
    // 读取数据
    //jetData,
};