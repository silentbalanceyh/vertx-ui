import {Button, Popover, Tooltip} from "antd";
import Act from "./Op.Act";
import Is from './Op.Is'
import React from "react";

const renderEdit = (reference, config = {}, item) => {
    const isDialog = Is.isDialog(reference, item);
    return isDialog ? (
        <Popover content={"Hello"} {...config.over.edit}
                 visible={Is.isVisible(reference, item)}>
            {renderEditButton(() => {
                
            })}
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

const renderAdd = (reference, config = {}, item) => {
    const isDialog = Is.isDialog(reference, item);
    return isDialog ? (
        <Popover content={"Hello"} {...config.over.add}
                 visible={Is.isVisible(reference, item)}>
            {renderAddButton(() => {

            })}
        </Popover>
    ) : (
        <Tooltip {...config.over.add}>
            {renderAddButton(Act.rxPreAdd(reference, item))}
        </Tooltip>
    )
};

export default {
    renderAdd,
    renderEdit
}