import React from 'react';
import Ux from "ux";
import {Button, Col, Modal, Row, Upload} from "antd";
import renderHTML from "react-render-html";
import {saveAs} from "file-saver";
import Sk from 'skin';
import "./Cab.norm.scss";

const UCA_NAME = "ExAnnounceView";
const renderFooter = (reference, onCancel) => {
    const action = Ux.fromHoc(reference, "action");
    return (
        <Button icon={Ux.v4Icon("close")} type={"primary"}
                onClick={onCancel}>
            {action.close}
        </Button>
    );
}

@Ux.zero(Ux.rxEtat(require('./Cab.json'))
    .cab(UCA_NAME)
    .to()
)
class Component extends React.PureComponent {
    displayName = UCA_NAME;
    render() {
        const {data = {}, visible = false, rxClose} = this.props;
        let dialog = Ux.fromHoc(this, "window");
        dialog = Ux.configDialog(this, dialog);

        // v4
        dialog.open = visible;
        // 特殊关闭函数
        dialog.onCancel = rxClose
        dialog.footer = renderFooter(this, rxClose);
        const attrView = Sk.mixEx(UCA_NAME, null, {
            _className: "ux_dialog"
        });
        Object.assign(dialog, attrView);
        // dialog.className = `ux_dialog ex-announce-window`;
        return (
            <Modal {...dialog}>
                <Row>
                    <Col span={24} className={"title"}>
                        <h2>{data.name}</h2>
                    </Col>
                </Row>
                <hr/>
                <Row>
                    <Col span={24} className={"content"}>
                        {/* Fix:  Cannot read properties of undefined (reading 'length') */}
                        {visible ? renderHTML(data.content ? data.content : "") : false}
                    </Col>
                </Row>
                <hr/>
                <Row>
                    <Col span={24} className={"file"}>
                        {(() => {
                            const {files = []} = data;
                            const attrs = {};
                            attrs.showUploadList = {
                                showPreviewIcon: true,          // 预览专用
                                showRemoveIcon: false
                            }
                            attrs.fileList = Ux.xtUploadMime(files, this);
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
}

export default Component