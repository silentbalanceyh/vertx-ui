import React from 'react';
import {Button, Col, Icon, Row, Tag, Tooltip, Upload} from 'antd';
import Ux from 'ux';
import Op from './Op';

const renderFile = (reference) => {
    const action = Ux.fromHoc(reference, "action");
    // 按钮操作
    const button = action.button ? action.button : {};
    const {handler = {}, fileList = [], $listType} = reference.state;
    const attrs = {};
    attrs.fileList = Ux.xtUploadMime(fileList);
    attrs.showUploadList = {
        showPreviewIcon: true,          // 预览专用
        showRemoveIcon: true
    };
    attrs.multiple = true;              // 是否支持多文件上传
    attrs.listType = $listType;          // 文件卡片显示
    const upload = {
        ...handler,
        ...attrs
    };
    return (
        <Upload.Dragger {...upload}
                        className={"operation"}>
            <Icon type={button.icon} className={"op-icon"}/>
            <label className={"op-label"}>{button.text}</label>
        </Upload.Dragger>
    )
}
const renderBar = (reference) => {
    const info = Ux.fromHoc(reference, "info");
    const {$listType, fileList = []} = reference.state;

    const btnCard = {}
    btnCard.icon = "appstore";
    btnCard.type = "picture-card" === $listType ? "primary" : "default";
    btnCard.onClick = Op.rxVCard(reference);

    const btnList = {};
    btnList.icon = "unordered-list";
    btnList.type = "picture-card" !== $listType ? "primary" : "default";
    btnList.onClick = Op.rxVList(reference);

    const btnClean = {}
    btnClean.icon = "delete";
    btnClean.type = "danger";
    btnClean.onClick = Op.rxVClean(reference);
    btnClean.disabled = 0 === fileList.length;

    return (
        <Row className={"op-bar"}>
            <Col>
                <Button.Group className={"action"}>
                    <Tooltip title={info['vSave']}>
                        <Button {...btnClean}/>
                    </Tooltip>
                    <Tooltip title={info['vCard']}>
                        <Button {...btnCard}/>
                    </Tooltip>
                    <Tooltip title={info['vList']}>
                        <Button {...btnList}/>
                    </Tooltip>
                </Button.Group>
                <Tag color={"magenta"}>
                    {info['iTip']}
                </Tag>
            </Col>
        </Row>
    )
}
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    renderBar,
    renderFile
}