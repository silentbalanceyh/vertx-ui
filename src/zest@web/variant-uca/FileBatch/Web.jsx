import React from 'react';
import {Button, Col, Row, Tag, Tooltip, Upload} from 'antd';
import Op from './Op';
import __Zn from '../zero.uca.dependency';
/*
 * Fix: https://gitee.com/silentbalanceyh/vertx-zero-scaffold/issues/I6W2AT
 */
const __itemRender = (upload = {}) => {
    if (__Zn.Env.TYPE_UPLOAD.CARD === upload.listType) {
        upload.itemRender = (origin) => {
            const {children = []} = origin.props;
            const [icon, title = [], ...rest] = children;
            const [left, right] = title;
            const ui = React.cloneElement(origin, {
                children: [
                    icon,
                    [left, right],
                    ...rest,
                ]
            })
            return (
                <Tooltip title={left.props.title}>
                    {ui}
                </Tooltip>
            )
        }
    }
}
const renderFile = (reference) => {
    const action = __Zn.fromHoc(reference, "action");
    // 按钮操作
    const button = action.button ? action.button : {};
    const {handler = {}, fileList = [], $listType} = reference.state;
    const attrs = {};
    attrs.fileList = __Zn.xtUploadMime(fileList);
    const attrUpload = {};
    const isEdition = __isEdition(reference);
    if (isEdition) {
        attrUpload.showPreviewIcon = true;
        attrUpload.showRemoveIcon = true;
    } else {
        attrUpload.showPreviewIcon = false;
        attrUpload.showRemoveIcon = false;
    }
    attrs.showUploadList = attrUpload;
    attrs.multiple = true;              // 是否支持多文件上传
    attrs.listType = $listType;          // 文件卡片显示
    const upload = {
        ...handler,
        ...attrs,
        disabled: !isEdition
    };
    // className processing
    if (isEdition) {
        upload.className = "operation";
    } else {
        upload.className = "operation_disabled";
    }
    __itemRender(upload);
    return (
        <Upload.Dragger {...upload}>
            {__Zn.v4Icon(button.icon, {className: "op-icon"})}
            <label className={"op-label"}>{button.text}</label>
        </Upload.Dragger>
    );
}

const __isEdition = (reference) => {
    const {readOnly = false} = reference.props;
    return !readOnly;
}
const renderBar = (reference) => {
    const info = __Zn.fromHoc(reference, "info");
    const {$listType, fileList = []} = reference.state;
    const edition = __isEdition(reference);

    const btnCard = {}
    // v4
    btnCard.icon = __Zn.v4Icon("appstore");
    btnCard.type = __Zn.Env.TYPE_UPLOAD.CARD === $listType
        ? "primary" : "default";
    if (edition) {
        btnCard.onClick = Op.rxVCard(reference);
    }
    btnCard.disabled = !edition;

    const btnList = {};
    // v4
    btnList.icon = __Zn.v4Icon("unordered-list");
    btnList.type = __Zn.Env.TYPE_UPLOAD.CARD !== $listType
        ? "primary" : "default";
    if (edition) {
        btnList.onClick = Op.rxVList(reference);
    }
    btnList.disabled = !edition;

    const btnClean = {}
    // v4
    btnClean.icon = __Zn.v4Icon("delete");
    // btnClean.type = "danger";
    btnClean.danger = true;
    btnClean.type = "primary";
    if (edition) {
        btnClean.onClick = Op.rxVClean(reference);
    }
    btnClean.disabled = 0 === fileList.length || !edition;
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