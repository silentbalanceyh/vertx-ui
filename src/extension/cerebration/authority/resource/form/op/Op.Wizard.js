import Ux from 'ux';
import React from 'react';
import {Button, Popconfirm} from 'antd';
import Event from './Op.Event';
import Ex from "ex";
import Form from "../UI.Perm.Select";

const _mountRender = ($columns = [], reference) => {
    /*
     * 特殊 render 处理
     */
    const confirmMessage = Ux.fromHoc(reference, "confirm");
    $columns.forEach(column => {
        if ("permName" === column.dataIndex) {
            column.render = Ux.cellWrapper(column, (text, record) => {
                return (
                    <div className={"web-op-link"}>
                        <div className={"left"}>{text}</div>
                        <Button className={"right"}
                                onClick={Event.rxAdd(reference, record)}
                                size={"small"} icon={Ux.v4Icon("plus")}/>
                    </div>
                );
            })
        } else if ("permOp" === column.dataIndex) {
            column.render = (text, record) => {
                const {actions = []} = record.data;
                return (
                    <div className={"web-op-link"}>
                        {0 < actions.length ? (
                            <Popconfirm title={confirmMessage}
                                        onConfirm={Event.rxDelete(reference, record)}>
                                <Button icon={Ux.v4Icon("delete")} size={"small"}
                                        className={"left"} danger/>
                            </Popconfirm>
                        ) : false}
                    </div>
                );
            }
        }
    });
    return $columns;
}

const yiStep2 = (reference) => {
    const state = {};
    const table = Ux.fromHoc(reference, "table");
    const $table = Ux.clone(table);
    const $columns = Ux.configColumn(reference, table.columns);

    $table.className = "ux_table";
    $table.columns = _mountRender($columns, reference);
    /*
     * 数据本身
     */
    const {$inited = {}} = reference.props;
    if (!Ux.isEmpty($inited)) {
        // 初始化数据
        const {permissions = []} = $inited;
        state.$data = Event.toData(permissions);
    }
    state.$table = $table;
    /*
     * 窗口配置
     */
    Ex.uiDialog(reference).child(() => {
        const {$inited = {}} = reference.state;
        const {$removed = []} = reference.props;
        return (<Form {...Ex.yoAmbient(reference)}
                      $removed={$removed}
                      $inited={$inited}
                      rxAdd={(permId, action) => {
                          Ex.uiDialog(reference, __dialog => __dialog.onClose());
                          Ux.fn(reference).rxAdd(permId, action);
                      }}/>)
    }).onMount(state);
    Ux.of(reference).in(state).ready().done();
    // state.$ready = true;
    // reference.?etState(state);
}
const yuStep2 = (reference, virtualRef) => {
    const checked = Ex.upValue(reference.props, virtualRef.props, "$inited");
    if (checked && checked.current) {
        const {permissions = []} = checked.current;
        Ux.of(reference).in({
            $data: Event.toData(permissions)
        }).done()
        // reference.?etState({$data: Event.toData(permissions)});
    }
}
export default {
    yiStep2,
    yuStep2,
}