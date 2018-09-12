import {Button, Input, Popconfirm, Tooltip} from "antd";
import React from "react";
import Ux from 'ux';
import Act from './Op.Act';

const _renderDelete = (reference, config = {}, item) => {
    return (
        <Popconfirm {...config.confirm.delete}
                    onConfirm={Act.rxDelete(reference, item)}>
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
                    className={"web-tree-addon"}
                    onClick={Act.rxPreEdit(reference, item)}/>
        </Tooltip>
    )
};

const _renderAdd = (reference, config = {}, item) => {
    return (
        <Tooltip {...config.over.add}>
            <Button icon={"plus"} shape={"circle"} size={"small"}
                    className={"web-tree-addon"}
                    onClick={Act.rxPreAdd(reference, item)}/>
        </Tooltip>
    )
};
const _renderYes = (reference, config = {}, item) => {
    return (
        <Button icon={"check"} shape={"circle"} size={"small"}
                className={"web-tree-addon"} type={"primary"}
                onClick={Act.rxEdit(reference, item)}
        />
    )
};

const _renderNo = (reference) => {
    return (
        <Button icon={"undo"} shape={"circle"} size={"small"}
                className={"web-tree-addon"}
                onClick={Act.rxCancel(reference)}
        />
    )
};

const renderOp = (reference, item = {}) => {
    const config = Ux.fromHoc(reference, "item");
    const {iKey} = reference.state;
    return (
        <span>
            {iKey === item.key ? _renderYes(reference, config, item) : false}
            {iKey === item.key ? _renderNo(reference, config, item) : false}
            {!iKey ? _renderAdd(reference, config, item) : false}
            {!iKey ? _renderEdit(reference, config, item) : false}
            {!iKey ? _renderDelete(reference, config, item) : false}
        </span>
    )
};

const renderInput = (reference, item = {}) => {
    const {iKey, iItemText = ""} = reference.state;
    return iKey === item.key ? (
        <Input value={iItemText} className={"web-tree-input"}
               onChange={Act.rxChange(reference)}/>
    ) : item.display;
};

export default {
    renderOp,
    renderInput,
}