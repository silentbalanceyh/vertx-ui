import {Button, Modal, Upload} from "antd";
import React from "react";
import __Zn from "../zero.uca.dependency";

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
        ...handler,
        ...attrs
    };
    return (
        <Upload listType={listType}
                {...upload}>
            {"picture-card" === listType ? (
                <span>
                    {__Zn.v4Icon("upload")}
                    {text ? <br/> : false}
                    {text ? <span className={"ant-upload-text"}>{text}</span> : false}
                </span>
            ) : (
                $imageUrl ? (
                    <img src={$imageUrl} alt={"avatar"}/>
                ) : (() => {
                    if (meta.disabled || meta.readOnly) {
                        return false;
                    } else {
                        return (
                            <Button disabled={meta.disabled}>
                                {__Zn.v4Icon("upload")}
                                {text ? <span className={"ant-upload-text"}>{text}</span> : false}
                            </Button>
                        );
                    }
                })()
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
    const fnClose = () => {

        __Zn.of(reference).in({
            $current_url: undefined,
            $current_name: undefined,
            // $visible: false
        }).hide().done();
        // reference.?etState({
        //     $current_url: undefined,
        //     $current_name: undefined,
        //     $visible: false
        // })
    };
    attrs.onCancel = fnClose;
    attrs.onOk = fnClose;
    // 设置窗口以及其他信息
    attrs.open = $visible;
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