import U from 'underscore';
import './Cab.less';
import React from 'react';
import {Button} from 'antd';
import Evt from './O.event';

import Abs from '../abyss';
import Ut from '../unity';
import E from '../error';
import Eng from '../engine';

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
        data.push({key: Ut.randomUUID()});
    } else {
        data.splice(index + 1, 0, {key: Ut.randomUUID()});
    }
    data = Abs.clone(data);
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
    data = Abs.clone(data);
    reference.setState({data});
    Evt.xtChange(reference, data, "data");
};

const _xtOp = (reference, column = {}, jsx, render = {}) => {
    const fnRender = render['key'];
    if (render.hasOwnProperty('key') && U.isFunction(fnRender)) {
        return fnRender(reference, column, jsx);
    } else {
        const disabled = jsx.readOnly;
        return (text, record, index) => {
            const attrs = {};
            attrs.index = index; // 索引处理专用
            return (
                <Button.Group className={"web-table-editor-op"}>
                    <Button icon={"plus"}
                            disabled={disabled}
                            style={{borderRight: 0}}
                            onClick={_xt2Add(reference, attrs)}/>
                    <Button disabled={disabled || 0 === index} icon={"minus"}
                            style={{marginLeft: 0}}
                            onClick={_xt2Remove(reference, attrs)}/>
                </Button.Group>
            );
        };
    }
};

/**
 *
 * ## 标准函数
 *
 * 对表格类型的组件执行列渲染处理，调用内部的`aiUnitRenders`方法。
 *
 * @memberOf module:_xt
 * @param {ReactComponent} reference React组件引用。
 * @param {Array} columns 列渲染信息。
 * @return {Array} 返回表格中处理过后的列。
 */
const xtColumn = (reference, columns = []) => {
    const {$render = {}, ...rest} = reference.props;
    // 构造核心参数，移除掉原始的config节点相关信息
    const jsx = Abs.clone(rest);
    if (jsx) {
        delete jsx.config;
    }
    columns = Eng.aiExprColumn(columns);
    columns.forEach(column => {
        if ("key" === column.dataIndex) {
            column.render = _xtOp(reference, column, jsx, $render);
            column.style = {width: "80px"};
        } else {
            let fnRender = $render[column.dataIndex];
            if (!fnRender) {
                const type = column['$render'] ? column["$render"] : "TEXT";
                // const renders = Eng.aiUnitRenders;
                // fnRender = renders[type];
                // E.fxTerminal(!fnRender, 10083, column.dataIndex, fnRender);
            }
            // column.render = fnRender(reference, column, jsx);
        }
    });
    return columns;
};
/**
 * ## 标准函数
 *
 * 根据状态中的 `data` 节点执行表格中数组的初始化，每条数据带有序号信息`sequence`（序号等于索引加一）。
 *
 * @memberOf module:_xt
 * @param {ReactComponent} reference React组件引用。
 * @return {Array} 返回数组信息。
 */
const xtData = (reference) => {
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
    xtData,
};