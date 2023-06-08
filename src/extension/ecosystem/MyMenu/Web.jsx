import Ux from "ux";
import {Button, Empty, Modal, Tooltip} from "antd";
import React from "react";
import Op from "./Op";
import UITransfer from './UI.Transfer';

const renderExtra = (reference) => {
    const {$admin = false, $changed} = reference.state;
    if ($admin) {
        const button = Ux.fromHoc(reference, "button");
        const {$submitting = false} = reference.state;
        return (
            <Button icon={Ux.v4Icon("save")} className={"admin-button"} type={"primary"}
                    loading={$submitting}
                    disabled={undefined === $changed}
                    onClick={Op.onSave(reference)}
            >{button.save}</Button>
        );
    } else return false;
}

const renderButton = (reference, {data, first, last}) => {
    const {$admin = false} = reference.state;
    if ($admin) {
        const link = Ux.fromHoc(reference, "link");
        const event = Op.toolkit(reference, data)
        return (
            <Button.Group size={"small"}>
                {link.filter(item => {
                    if (first || last) {
                        if (first && !last) {
                            return !["rxLeft"].includes(item.key)
                        } else if (last && !first) {
                            return !["rxRight"].includes(item.key)
                        } else {
                            return ["rxDelete"].includes(item.key)
                        }
                    } else return true;
                }).map(each => {
                    const {tooltip, ...rest} = each;
                    return (
                        <Tooltip title={tooltip} key={each.key}>
                            <Button {...rest} onClick={event[each.key]}/>
                        </Tooltip>
                    )
                })}
            </Button.Group>
        )
    } else return false;
}
const renderDialog = (reference) => {
    const {config = {}, store} = reference.props;
    const {$data = [], $tree = [], $treeConfig = {}, $visible = false} = reference.state;
    const dialog = Ux.fromHoc(reference, "dialog");
    const dialogConfig = Ux.configDialog(reference, dialog.window);
    dialogConfig.open = $visible;
    dialogConfig.className = dialogConfig.className + "umy_MyMenu_Dialog";
    // 执行挂载
    const inherits = {}
    inherits.data = $data;
    inherits.config = config;
    // Fix: https://github.com/silentbalanceyh/ox-engine/issues/1149
    inherits.store = store;
    inherits.tree = $tree;
    inherits.treeConfig = $treeConfig;
    inherits.rxClose = ($data) => {
        const state = {};
        // state.$visible = false;
        state.$data = $data;
        state.$changed = Ux.randomString(8);
        Ux.of(reference).in(state).hide().done();
        // reference.?etState(state);
        // state.$ready = true;
    }
    return (
        <Modal {...dialogConfig}>
            <UITransfer {...inherits}/>
        </Modal>
    )
}
const renderAdd = (reference) => {
    const {$admin = false} = reference.state;
    if ($admin) {
        const info = Ux.fromHoc(reference, "info");
        return (
            <div className={"range"}>
                {/* eslint-disable-next-line */}
                <a className={"app_link"} onClick={Op.onAdd(reference)}>
                    {Ux.v4Icon("tool", {
                        className: "app_icon",
                        style: {color: "#48aaf7"}
                    })}
                    <span className={"label"}
                          style={{color: "#48aaf7"}}>{info.add}</span>
                </a>
                {renderDialog(reference)}
            </div>
        );
    } else return false;
}
const renderEmpty = (reference, $data = []) => {
    const {$admin = false} = reference.state;
    if (!$admin && 0 === $data.length) {
        // 非管理模式，数据为0
        const info = Ux.fromHoc(reference, "info")
        return (
            <Empty description={info.empty}/>
        )
    } else return false;
}
export default {
    renderExtra,
    renderButton,
    renderEmpty,
    renderAdd
}