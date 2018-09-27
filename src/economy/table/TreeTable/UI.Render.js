import React from 'react'
import DialogButton from '../../op/DialogButton/UI';
import {Button, Popconfirm} from 'antd';
import './Cab.less';
import Ux from 'ux';
import U from 'underscore';

const renderOp = (reference, record, {
    text, rowSpan, column
}) => {
    const config = column.config ? column.config : {};
    const enabled = config["op.enabled"];
    // 按钮部分
    const add = config['op.add'];
    const edit = config['op.edit'];
    const deleted = config['op.delete'];
    // Form组件
    const Form = reference.props[config.form];
    const window = Ux.aiExprWindow(config.window);
    // 绑定函数，主要用于删除
    const {
        $action = {}, $datum = {},
        rxRecord = data => data
    } = reference.props;
    // 处理数据信息
    const levelPrefix = String(column.level);
    const data = {};
    Object.keys(record).filter(key => key.startsWith(levelPrefix))
        .forEach(key => {
            const reg = new RegExp(`${levelPrefix}.`, "g");
            const field = key.replace(reg, "");
            data[field] = record[key];
        });
    // onOk确认框处理
    const connectEdit = column["op.edit.connect"] ? column["op.edit.connect"] : "$opSave";
    const connectAdd = column["op.add.connect"] ? column["op.add.connect"] : "$opAdd";
    const jsx = {};
    jsx.props = {
        rowSpan
    };
    if (0 < rowSpan) {
        jsx.children = (
            <span className={"web-table-cell"}>
                <span className={"left"}>
                {text}
                </span>
                <span className={"right"}>
                    {enabled ? (
                        <Button.Group>
                            {add ? (
                                <DialogButton $form={Form} $datum={$datum}
                                              $inited={rxRecord({}, record, column.level)}
                                              fnConfirm={() => Ux.connectId(connectAdd)}
                                              $config={{
                                                  button: {
                                                      text: add, icon: "plus",
                                                  },
                                                  window,
                                              }}/>) : false}
                            {edit && text ? (
                                <DialogButton $form={Form} $datum={$datum}
                                              $inited={rxRecord(data, record, column.level)}
                                              fnConfirm={() => Ux.connectId(connectEdit)}
                                              $config={{
                                                  button: {
                                                      text: edit, icon: "edit",
                                                  },
                                                  window,
                                              }}/>) : false}
                            {deleted && text ? (
                                <Popconfirm title={deleted} onConfirm={event => {
                                    event.preventDefault();
                                    const executor = $action[config["op.delete.fun"]];
                                    if (U.isFunction(executor)) {
                                        executor(data);
                                    }
                                }}>
                                    <Button icon={"delete"} type={"danger"} style={{}}/>
                                </Popconfirm>) : false}
                        </Button.Group>
                    ) : false}
                </span>
            </span>
        )
    }
    return jsx;
};
export default {
    renderOp
}