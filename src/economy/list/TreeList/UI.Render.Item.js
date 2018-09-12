import {Button, Popconfirm, Tooltip} from "antd";
import React from "react";
import Ux from 'ux';

const renderOp = (reference, item = {}) => {
    const config = Ux.fromHoc(reference, "item");
    return (
        <span>
            <Button icon={"plus"} shape={"circle"} size={"small"}
                    className={"web-tree-addon"}/>
            <Button icon={"edit"} shape={"circle"} size={"small"}
                    className={"web-tree-addon"}/>
            <Tooltip placement={"top"} title={config.over.delete}>
                <Popconfirm {...config.confirm.delete}>
                    <Button icon={"minus"} shape={"circle"}
                            size={"small"}
                            className={"web-tree-addon ux-red"}/>
                </Popconfirm>
            </Tooltip>
        </span>
    )
};

export default {
    renderOp
}