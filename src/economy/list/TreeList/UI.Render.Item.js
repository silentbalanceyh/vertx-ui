import {Button, Input, Popconfirm, Tooltip} from "antd";
import React from "react";
import Ux from 'ux';
import Op from './Op.Visit'
import U from 'underscore';

const _renderDelete = (reference, config = {}, item) => {
    return (
        <Popconfirm {...config.confirm.delete} onConfirm={(event) => {
            // 是否触发外置操作
            event.preventDefault();
            const {rxItemDelete} = reference.props;
            if (U.isFunction(rxItemDelete)) {
                const keys = Op.visitChildren(item);
                rxItemDelete(item, keys);
            }
        }}>
            <Button icon={"minus"} shape={"circle"}
                    size={"small"}
                    className={"web-tree-addon ux-red"}/>
        </Popconfirm>
    )
};
const _renderEdit = (reference, config = {}, item) => {
    return (
        <Tooltip {...config.over.edit}>
            <Button icon={"edit"} shape={"circle"} size={"small"}
                    className={"web-tree-addon"} onClick={event => {
                event.preventDefault();
                reference.setState({
                    iKey: item.key,
                    iItemData: item,
                    iItemText: item.display,
                })
            }}/>
        </Tooltip>
    )
};

const _renderYes = (reference, config = {}, item) => {
    return (
        <Button icon={"check"} shape={"circle"} size={"small"}
                className={"web-tree-addon"} type={"primary"}
        />
    )
};

const _renderAdd = (reference, config = {}, item) => {
    return (
        <Button icon={"plus"} shape={"circle"} size={"small"}
                className={"web-tree-addon"}/>
    )
};

const _renderNo = (reference, config = {}, item) => {
    return (
        <Button icon={"undo"} shape={"circle"} size={"small"}
                className={"web-tree-addon"}
                onClick={event => {
                    event.preventDefault();
                    reference.setState({
                        iKey: undefined,
                        iItemData: undefined,
                        iItemText: undefined,
                    })
                }}
        />
    )
};

const renderOp = (reference, item = {}) => {
    const config = Ux.fromHoc(reference, "item");
    const {iKey} = reference.state;
    return (
        <span>
            {iKey ? _renderYes(reference, config, item) : false}
            {iKey ? _renderNo(reference, config, item) : false}
            {!iKey ? _renderAdd(reference, config, item) : false}
            {!iKey ? _renderEdit(reference, config, item) : false}
            {!iKey ? _renderDelete(reference, config, item) : false}
        </span>
    )
};

const _onChange = (reference, item = {}) => (event) => {
    event.preventDefault();
    reference.setState({iItemText: event.target.value});
};

const renderInput = (reference, item = {}) => {
    const {iKey, iItemText = ""} = reference.state;
    return iKey ? (
        <Input value={iItemText} className={"web-tree-input"}
               onChange={_onChange(reference, item)}/>
    ) : item.display;
};

export default {
    renderOp,
    renderInput,
}