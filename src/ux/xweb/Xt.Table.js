import Ux from 'ux';
import U from 'underscore';
import './Cab.less';
import React from 'react';
import {Button} from 'antd';
import E from "../Ux.Error";

const _xtOp = (reference, column = {}, jsx, render = {}) => {
    const fnRender = render['key'];
    if (render.hasOwnProperty('key') && U.isFunction(fnRender)) {
        return fnRender(reference, column, jsx);
    } else {
        return (text, record, index) => (
            <Button.Group className={"web-table-editor-op"}>
                <Button icon={"plus"}/>
                <Button disabled={0 === index} icon={"minus"} style={{marginLeft: 0}}/>
            </Button.Group>
        )
    }
};

const xtColumn = (reference, columns = []) => {
    const {$render = {}, ...rest} = reference.props;
    // 构造核心参数，移除掉原始的config节点相关信息
    const jsx = Ux.clone(rest);
    if (jsx) {
        delete jsx.config;
    }
    columns = Ux.aiExprColumn(columns);
    columns.forEach(column => {
        if ("key" === column.dataIndex) {
            column.render = _xtOp(reference, column, jsx, $render);
            column.style = {width: "80px"}
        } else {
            let fnRender = $render[column.dataIndex];
            if (!fnRender) {
                const type = column['$render'] ? column["$render"] : "TEXT";
                const renders = Ux.aiUnitRenders;
                fnRender = renders[type];
                E.fxTerminal(!fnRender, 10083, column.dataIndex, fnRender);
            }
            column.render = fnRender(reference, column, jsx);
        }
    });
    return columns;
};
const xtSource = (reference) => {
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
export default {
    xtColumn,
    xtSource
};