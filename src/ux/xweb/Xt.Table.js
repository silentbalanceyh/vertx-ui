import Ux from 'ux';
import U from 'underscore';
import './Cab.less';
import React from 'react';
import {Button} from 'antd';
import E from "../Ux.Error";
import Util from '../util';
import Value from '../value';
import Evt from './Xt.Event';

const _xt2Add = (reference, {
    index
}) => (event) => {
    // Button处理默认事件
    if (U.isFunction(event.preventDefault)) {
        event.preventDefault();
    }
    // 读取Table中的数据
    const state = reference.state;
    E.fxTerminal(!state.data, 10052, state.data);
    let {data = []} = state;
    if (index === data.length) {
        data.push({key: Util.randomUUID()});
    } else {
        data.splice(index + 1, 0, {key: Util.randomUUID()});
    }
    data = Value.clone(data);
    // 更新数据信息
    reference.setState({data});
    // 变更处理
    Evt.xtChange(reference, data, "data");
};

const _xt2Remove = (reference, {
    index
}) => (event) => {
    // Button处理默认事件
    if (U.isFunction(event.preventDefault)) {
        event.preventDefault();
    }
    const state = reference.state;
    E.fxTerminal(!state.data, 10052, state.data);
    let {data = []} = state;
    data = data.filter((item, idx) => idx !== index);
    data = Value.clone(data);
    reference.setState({data});
    Evt.xtChange(reference, data, "data");
};

const _xtOp = (reference, column = {}, jsx, render = {}) => {
    const fnRender = render['key'];
    if (render.hasOwnProperty('key') && U.isFunction(fnRender)) {
        return fnRender(reference, column, jsx);
    } else {
        return (text, record, index) => {
            const attrs = {};
            attrs.index = index; // 索引处理专用
            // attrs.sequence = column.sequence; // 当前列的次序
            // attrs.defaultValue = column.defaultValue; // 当前按钮绑定的默认值
            return (
                <Button.Group className={"web-table-editor-op"}>
                    <Button icon={"plus"}
                            style={{borderRight: 0}}
                            onClick={_xt2Add(reference, attrs)}/>
                    <Button disabled={0 === index} icon={"minus"}
                            style={{marginLeft: 0}}
                            onClick={_xt2Remove(reference, attrs)}/>
                </Button.Group>
            );
        };
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
            column.style = {width: "80px"};
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
    let {data} = reference.state;
    if (U.isArray(data)) {
        data.forEach((item, index) => (item.sequence = (index + 1)));
    } else {
        data = [];
    }
    return data;
};
export default {
    xtColumn,
    xtSource
};