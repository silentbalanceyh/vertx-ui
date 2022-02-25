import Ux from "ux";
import {Button, Card, Carousel, Col, Modal, Row, Tooltip, Upload} from "antd";
import React from "react";
import {saveAs} from "file-saver";
import renderHTML from "react-render-html";

const renderView = (reference) => {
    const {$dialog = {}, $visible = false, $inited = {}} = reference.state;
    const dialog = Ux.clone($dialog);
    dialog.visible = $visible;
    // 特殊关闭函数
    dialog.onCancel = (event) => {
        Ux.prevent(event);
        reference.setState({$visible: false, $inited: undefined});
    }
    dialog.footer = renderFooter(reference, dialog.onCancel);
    dialog.className = `web-dialog ex-announce-window`;
    return (
        <Modal {...dialog}>
            <Row>
                <Col span={24} className={"title"}>
                    <h2>{$inited.name}</h2>
                </Col>
            </Row>
            <hr/>
            <Row>
                <Col span={24} className={"content"}>
                    {$visible ? renderHTML($inited.content) : false}
                </Col>
            </Row>
            <hr/>
            <Row>
                <Col span={24} className={"file"}>
                    {(() => {
                        const {files = []} = $inited;
                        const attrs = {};
                        attrs.showUploadList = {
                            showPreviewIcon: true,          // 预览专用
                            showRemoveIcon: false
                        }
                        attrs.fileList = Ux.xtUploadMime(files, reference);
                        attrs.onPreview = (file = {}) => Ux.ajaxDownload("/api/file/download/:key", file, {})
                            .then(data => saveAs(data, file.name))
                        return (
                            <Upload {...attrs}/>
                        )
                    })()}
                </Col>
            </Row>
        </Modal>
    )
}

const renderFooter = (reference, onCancel) => {
    const action = Ux.fromHoc(reference, "action");
    return (
        <Button icon={"close"} type={"primary"}
                onClick={onCancel}>
            {action.close}
        </Button>
    )
}

const renderAction = (reference, item = {}) => {
    const action = Ux.fromHoc(reference, "action");
    return (
        <div className={"action"}>
            <Button.Group size={"small"}>
                <Tooltip title={action.search}>
                    <Button icon={"search"} onClick={event => {
                        Ux.prevent(event);
                        Ux.ajaxGet("/api/x-notice/:key", {key: item.key})
                            .then($inited => reference.setState({$visible: true, $inited}))
                    }}/>
                </Tooltip>
                <Tooltip title={action.link}>
                    <Button icon={"link"} className={"ux-spec"}/>
                </Tooltip>
            </Button.Group>
            {renderView(reference)}
        </div>
    )
}

const renderNotice = (reference, data = []) => {
    return (
        <Carousel>
            {data.map(item => (
                <div key={item.key} className={"ex-content"}>
                    {renderAction(reference, item)}
                    <Card.Meta title={item.name}
                               description={(
                                   <div>
                                       {renderHTML(item.content)}
                                   </div>
                               )}/>
                </div>
            ))}
        </Carousel>
    )
}
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    renderNotice,
}