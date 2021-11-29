import Ux from "ux";
import {Button, Checkbox, Empty, Icon, List, Modal, Tooltip, Tree} from "antd";
import React from "react";
import Op from "./Op";
import UITransfer from './UI.Transfer';

const renderExtra = (reference) => {
    const {$admin = false, $changed} = reference.state;
    if ($admin) {
        const button = Ux.fromHoc(reference, "button");
        const {$submitting = false} = reference.state;
        return (
            <Button icon={"save"} className={"admin-button"} type={"primary"}
                    loading={$submitting}
                    disabled={undefined === $changed}
                    onClick={Op.onSave(reference)}
            >{button.save}</Button>
        )
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
    const {config = {}} = reference.props;
    const {$data = [], $tree = [], $treeConfig = {}, $visible = false} = reference.state;
    const dialog = Ux.fromHoc(reference, "dialog");
    const dialogConfig = Ux.configDialog(reference, dialog.window);
    dialogConfig.visible = $visible;
    dialogConfig.className = dialogConfig.className + " ux-my-menu-dialog";
    return (
        <Modal {...dialogConfig}>
            <UITransfer data={$data}
                        config={config}
                        tree={$tree}
                        rxClose={$data => {
                            const state = {};
                            state.$visible = false;
                            state.$data = $data;
                            state.$changed = Ux.randomString(8);
                            reference.setState(state);
                        }}
                        treeConfig={$treeConfig}/>
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
                <a className={"link"} onClick={Op.onAdd(reference)}>
                    <Icon type={"tool"}
                          className={"icon icon-add"}
                          style={{color: "#48aaf7"}}/>
                    <span className={"label"}
                          style={{color: "#48aaf7"}}>{info.add}</span>
                </a>
                {renderDialog(reference)}
            </div>
        )
    } else return false;
}
const renderSource = (reference, fn) => {
    const {$targetKeys = []} = reference.state;
    let {$sourceSelectedKeys = [], $treeData = []} = reference.state;
    $treeData = Ux.clone($treeData);
    Ux.itTree($treeData, item => {
        if ($targetKeys.includes(item.key)) {
            item.disabled = true;
        }
    });
    return (
        <div className={"source"}>
            <Tree treeData={$treeData}
                  checkable
                  defaultExpandAll
                  onCheck={Op.transfer(reference, fn).rxTree}
                  checkedKeys={$sourceSelectedKeys}/>
        </div>
    )
}
const renderTarget = (reference) => {
    const {$targetSelectedKeys = [], $data = [], $treeMap = {}} = reference.state;
    return (
        <div className={"target"}>
            <List dataSource={$data} renderItem={(item, index) => {
                const keys = Op.toKey(item, $treeMap);
                const checked = 0 < keys.filter(key => $targetSelectedKeys.includes(key)).length;
                return (
                    <span className={"target-item"}>
                        <span className={"left"}>
                            <Checkbox onChange={Op.transfer(reference, {
                                ...item,
                                keys,
                            }).rxList} checked={checked}/>&nbsp;&nbsp;
                            <Icon type={item.icon} style={{
                                ...item.style,
                                fontSize: 20
                            }}/>&nbsp;&nbsp;
                            {item.text}
                        </span>
                        <span className={"right"}>
                            <Button icon={"up"} size={"small"} type={"primary"}
                                    disabled={0 === index}
                                    onClick={event => {
                                        event.stopPropagation();
                                        const queue = $data.map(item => item.key);
                                        const $out = Ux.elementUp(queue, item.key);
                                        const ordered = Ux.elementOrder($data, $out);
                                        reference.setState({$data: ordered});
                                    }}/>
                            &nbsp;
                            <Button icon={"down"} size={"small"}
                                    disabled={($data.length - 1) === index}
                                    onClick={event => {
                                        event.stopPropagation();
                                        const queue = $data.map(item => item.key);
                                        const $out = Ux.elementDown(queue, item.key);
                                        const ordered = Ux.elementOrder($data, $out);
                                        reference.setState({$data: ordered});

                                    }}/>
                        </span>
                    </span>
                )
            }}/>
        </div>
    )
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
    renderAdd,
    renderSource,
    renderTarget
}