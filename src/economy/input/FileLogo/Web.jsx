import {Icon, Modal, Upload} from "antd";
import React from "react";

const renderFile = (reference) => {
    const {text} = reference.props;
    const {handler = {}, fileList = [], $imageUrl} = reference.state;
    const attrs = {};
    attrs.fileList = fileList;
    attrs.showUploadList = false;
    // Upload属性集
    const upload = {
        ...handler,
        ...attrs
    };
    if ($imageUrl) {
        upload.className = "ant-upload-preview";
    } else {
        upload.className = "";
    }
    return (
        <Upload listType={"picture-card"}
                {...upload}>
            {$imageUrl ? (
                <img src={$imageUrl} alt={text}/>
            ) : (
                <span>
                    <Icon type={"upload"} style={{
                        fontSize: 34
                    }}/>
                    {text ? <br/> : false}
                    {text ? <span className={"ant-upload-text"}>{text}</span> : false}
                </span>
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

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    renderFile,
    renderPreview
};