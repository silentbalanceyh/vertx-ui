import {Button, Popover, Tooltip} from "antd";
import Act from "./Op.Act";
import Is from './Op.Is'
import React from "react";

const onVisibleChange = (reference) => (visible) => {
    console.info(visible);
};

const renderAdd = (reference, config = {}, item) => {
    const isDialog = Is.isDialog(reference, item);
    return isDialog ? (
        <Popover content={"Hello"} {...config.over.add}
                 onVisibleChange={onVisibleChange(reference)}
                 visible={Is.isVisible(reference, item)}>
            {renderAddButton(Act.rxAddDialog(reference, item))}
        </Popover>
    ) : (
        <Tooltip {...config.over.add}>
            {renderAddButton(Act.rxPreAdd(reference, item))}
        </Tooltip>
    )
};
const renderEdit = (reference, config = {}, item) => {
    const isDialog = Is.isDialog(reference, item);
    return isDialog ? (
        <Popover content={"Hello"} {...config.over.edit}
                 onVisibleChange={onVisibleChange(reference)}
                 visible={Is.isVisible(reference, item, false)}>
            {renderEditButton(Act.rxEditDialog(reference, item))}
        </Popover>
    ) : (
        <Tooltip {...config.over.edit}>
            {renderEditButton(Act.rxPreEdit(reference, item))}
        </Tooltip>
    )
};

const renderEditButton = (onClick) => (
    <Button icon={"edit"} shape={"circle"} size={"small"}
            className={"web-tree-addon"}
            onClick={onClick}/>
);
const renderAddButton = (onClick) => (
    <Button icon={"plus"} shape={"circle"} size={"small"}
            className={"web-tree-addon"}
            onClick={onClick}/>
);

export default {
    renderAdd,
    renderEdit
}