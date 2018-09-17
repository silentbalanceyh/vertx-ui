import {Button, Input, Popconfirm} from "antd";
import React from "react";
import Ux from 'ux';
import Act from './Op.Act';
import Is from './Op.Is';
import Rdr from './UI.Render.Dialog';

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

const renderOp = (reference, item = {}, metadata = {}) => {
    const config = Ux.fromHoc(reference, "item");
    // 计算位置专用
    if (metadata.index) config._index = metadata.index;
    if (metadata.size) config._size = metadata.size;
    return (
        <span>
            {Is.isFast(reference, item) ? _renderYes(reference, config, item) : false}
            {Is.isFast(reference, item) ? _renderNo(reference, config, item) : false}
            {Is.isPreAdd(reference, item) ? Rdr.renderAdd(reference, config, item) : false}
            {Is.isPreEdit(reference, item) ? Rdr.renderEdit(reference, config, item) : false}
            {Is.isPreEdit(reference, item) ? _renderDelete(reference, config, item) : false}
        </span>
    )
};

const renderInput = (reference, item = {}) => {
    const {iItemText = ""} = reference.state;
    return Is.isFast(reference, item) ? (
        <Input value={iItemText} className={"web-tree-input"}
               onChange={Act.rxChange(reference)}/>
    ) : item.display;
};

export default {
    renderOp,
    renderInput,
}