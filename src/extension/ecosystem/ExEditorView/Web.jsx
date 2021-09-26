import {Button, Checkbox, Col, Icon, Modal, Popconfirm, Radio, Row, Switch, Tooltip} from "antd";
import React from "react";
import Ux from 'ux';
import Ex from 'ex';
import Op from './Op';
import ExView from '../ExView/UI';
import {Link} from "react-router-dom";

const renderDialog = (reference) => {
    const {
        $dialog = {},
        $inited = {},
    } = reference.state;
    const configDialog = {};
    if (Ux.isEmpty($inited)) {
        Object.assign(configDialog, $dialog.add);
    } else {
        Object.assign(configDialog, $dialog.edit);
    }
    /*
     * 字段集以及相关配置
     */
    const {config = {}, $options = {}} = reference.props;
    const {$columns} = config;
    const $parameters = {};
    $parameters.uri = $options[Ex.Opt.AJAX_SEARCH_URI];
    $parameters.method = "POST";    // 固定值

    const child = Ex.yoDialog(reference, configDialog);
    child.rxClose = (event, state) => {
        state.$dirty = true
        state.$visible = false
        reference.setState(state);
    }
    return (
        <Modal {...configDialog}>
            <ExView {...child}
                    $inited={$inited}
                    config={{
                        // 所有列的基础信息（Projection够了）
                        field: $columns,
                    }}
                    $parameters={$parameters}/>
        </Modal>
    );
}

const renderBar = (reference) => {
    const {
        $combine = {},
        $selectedKeys = [],
        $selectedKey
    } = reference.state;
    const {$myView = {}} = reference.props;
    const {toolbar = {}} = $combine;
    return (
        <Row>
            <Col span={14}>
                <Button.Group>
                    {(() => {
                        const {yes = {}} = toolbar;
                        const {text, ...rest} = yes;
                        // disabled
                        rest.disabled = $selectedKey === $myView.name;
                        return Op.isView(reference) ? (
                            <Button {...rest}
                                    onClick={Op.rxYes(reference)}>
                                {text}
                            </Button>
                        ) : false;
                    })()}
                    {(() => {
                        const {plus = {}} = toolbar;
                        const {tooltip, ...rest} = plus;
                        return Op.isEdit(reference) ? (
                            <Tooltip title={tooltip}>
                                <Button {...rest}
                                        onClick={Op.rxOpen(reference, {})}/>
                            </Tooltip>
                        ) : false
                    })()}
                </Button.Group>
                &nbsp;&nbsp;&nbsp;&nbsp;
                {(() => {
                    const {batch = {}} = toolbar;
                    const {text, icon, confirm} = batch;
                    return Op.isEdit(reference) ? (
                        <Popconfirm title={confirm}
                                    onConfirm={Op.rxDeleteBatch(reference, batch)}
                                    disabled={0 === $selectedKeys.length}>
                            <Link disabled={0 === $selectedKeys.length} to={""}>
                                <Icon type={icon}/>
                                &nbsp;{text}
                            </Link>
                        </Popconfirm>
                    ) : false;
                })()}
            </Col>
            <Col span={10} className={"v-list-switch"}>
                {(() => {
                    const {switcher = {}} = $combine;
                    return (
                        <Switch checked={Op.isView(reference)}
                                onChange={Op.rxSwitch(reference)}
                                checkedChildren={switcher.view}
                                unCheckedChildren={switcher.edit}/>
                    )
                })()}
            </Col>
        </Row>
    )
}
const renderItem = (reference) => (item) => {
    const {$myDefault = {}} = reference.props;
    let title = item.title;
    if (!title && $myDefault.name === item.name) {
        title = $myDefault.title;
    }
    const {
        $combine = {}, $selectedKeys = [],
        $selectedKey
    } = reference.state;
    const {toolbar = {}} = $combine;
    const itemAttr = {};
    if (Op.isEdit(reference)) {
        itemAttr.onDoubleClick = Op.rxOpen(reference, item);
    } else {
        itemAttr.onClick = Op.rxRadio(reference, item);
    }
    return (
        <Row className={"v-list-item"} {...itemAttr}>
            <Col span={2}>
                {Op.isEdit(reference) ? (
                    <Checkbox onChange={Op.rxChecked(reference, item)}
                              checked={$selectedKeys.includes(item.key)}/>
                ) : false}
                {Op.isView(reference) ? (
                    <Radio name={"rdoView"} checked={$selectedKey === item.name}
                           onChange={Op.rxRadio(reference, item)}/>
                ) : false}
            </Col>
            <Col span={10}>
                {title}（{item.name}）
            </Col>
            <Col span={12} className={"v-list-right"}>
                {(() => {
                    const {edit = {}} = toolbar;
                    return Op.isEdit(reference) ? (
                        <Link onClick={Op.rxOpen(reference, item)} to={""}>
                            <Icon type={edit.icon}/>
                            &nbsp;{edit.text}
                        </Link>
                    ) : false
                })()}
                &nbsp;&nbsp;&nbsp;&nbsp;
                {(() => {
                    const {remove = {}} = toolbar;
                    return Op.isEdit(reference) ? (
                        <Popconfirm title={remove.confirm}
                                    onConfirm={Op.rxDelete(reference, item, remove)}>
                            <Link to={""}>
                                <Icon type={remove.icon}/>
                                &nbsp;{remove.text}
                            </Link>
                        </Popconfirm>
                    ) : false
                })()}
            </Col>
        </Row>
    )
}
const renderHeader = (reference, header) => {
    return (
        <div className={"checked-all"}>
            {header}
        </div>
    )
}
export default {
    // Dialog, Bar
    renderDialog,
    renderBar,
    // List中的Item渲染
    renderItem,
    renderHeader,
}