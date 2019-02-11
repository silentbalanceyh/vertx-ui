import {Button, Icon, Modal, Upload} from "antd";
import React from "react";

const renderFile = (reference) => {
    const {listType, text, ...meta} = reference.props;
    const {handler = {}, $imageUrl, fileList = []} = reference.state;
    const attrs = {};
    attrs.fileList = fileList;
    attrs.showUploadList = {
        showPreviewIcon: true, // 预览专用
        showRemoveIcon: true
    };
    // Upload属性集
    const upload = {
        ...meta,
        ...handler,
        ...attrs
    };
    return (
        <Upload listType={listType}
                {...upload}>
            {"picture-card" === listType ? (
                <span>
                    <Icon type={"upload"}/>
                    {text ? <br/> : false}
                    {text ? <span className={"ant-upload-text"}>{text}</span> : false}
                    </span>
            ) : (
                $imageUrl ? (
                    <img src={$imageUrl} alt={"avatar"}/>
                ) : (
                    <Button disabled={meta.disabled}>
                        <Icon type={"upload"}/>
                        {text ?
                            <span className={"ant-upload-text"}>{text}</span> : false}
                    </Button>
                )
            )}
        </Upload>
    );
};
const renderPreview = (reference) => {
    const {
        $visible,
        $current_url,
        $current_name
    } = reference.state;
    const attrs = {};
    const fnClose = () => reference.setState({
        $current_url: undefined,
        $current_name: undefined,
        $visible: false
    });
    attrs.onCancel = fnClose;
    attrs.onOk = fnClose;
    // 设置窗口以及其他信息
    attrs.visible = $visible;
    attrs.maskClosable = false;
    const style = {
        width: 720, height: 480
    };
    return (
        <Modal {...attrs} {...style} title={$current_name}>
            <img src={$current_url} alt={"Preview"} style={{
                width: style.width - 50,
                height: style.height - 40
            }}/>
        </Modal>
    );
};
export default {
    renderFile,
    renderPreview
};