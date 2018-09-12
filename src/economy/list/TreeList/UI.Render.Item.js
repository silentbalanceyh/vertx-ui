import {Button, Input, Popconfirm, Popover} from "antd";
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
        <Popover {...config.over.edit}>
            <Button icon={"edit"} shape={"circle"} size={"small"}
                    className={"web-tree-addon"} onClick={event => {
                event.preventDefault();
                reference.setState({
                    iEditKey: item.key,
                    iAddKey: undefined,
                    iItemData: item,
                })
            }}/>
        </Popover>
    )
};

const renderOp = (reference, item = {}) => {
    const config = Ux.fromHoc(reference, "item");
    return (
        <span>
            <Button icon={"plus"} shape={"circle"} size={"small"}
                    className={"web-tree-addon"}/>
            {_renderEdit(reference, config, item)}
            {_renderDelete(reference, config, item)}
        </span>
    )
};

const renderInput = (reference, item = {}) => {
    const {iEditKey, iItemData = {}} = reference.state;
    return iEditKey ? (
        <Input value={iItemData.display}/>
    ) : item.display;
};

export default {
    renderOp,
    renderInput,
}