import {Button, Popover, Tooltip} from "antd";
import './Cab.less'
import Act from "./Op.Act";
import Is from './Op.Is'
import React from "react";

const renderClose = (reference, item, title) => {
    return (
        <span className={"web-tree-popover-title"}>
            <span>{title ? title : false}</span>
            <Button icon={"close"} type={"danger"} shape={"circle"}
                    onClick={Act.rxCloseDialog(reference, item)}/>
        </span>
    )
};

const renderAdd = (reference, config = {}, item) => {
    const isDialog = Is.isDialog(reference, item);
    if (isDialog) {
        const {$formTreeAdd: Form} = reference.props;
        return (
            <Popover content={<Form {...reference.props}
                                    $inited={item}/>}
                     placement={"right"}
                     visible={Is.isVisible(reference, item)}
                     title={renderClose(reference, item,
                         config.over.add.title)}>
                {renderAddButton(Act.rxAddDialog(reference, item))}
            </Popover>
        )
    } else {
        return (
            <Tooltip {...config.over.add}>
                {renderAddButton(Act.rxPreAdd(reference, item))}
            </Tooltip>
        )
    }
};
const renderEdit = (reference, config = {}, item) => {
    const isDialog = Is.isDialog(reference, item);
    if (isDialog) {
        const {$formTreeEdit: Form} = reference.props;
        return (
            <Popover content={<Form {...reference.props}
                                    $inited={item}/>}
                     placement={"right"}
                     visible={Is.isVisible(reference, item, false)}
                     title={renderClose(reference, item,
                         config.over.edit.title)}>
                {renderEditButton(Act.rxEditDialog(reference, item))}
            </Popover>
        )
    } else {
        return (
            <Tooltip {...config.over.edit}>
                {renderEditButton(Act.rxPreEdit(reference, item))}
            </Tooltip>
        )
    }
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