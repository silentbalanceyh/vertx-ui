import React from 'react';
import ExButton from '../ExButton/UI';

import Ux from "ux";
import Ex from "ex";
import {Button, Col, Modal, Popover, Row} from "antd";


const jsxTitle = (reference, config = {}) =>
    (
        <Row>
            <Col span={23}>
                <h3>{config.title}</h3>
            </Col>
            <Col span={1} style={{
                paddingTop: 3
            }}>
                <Button shape={"circle"} icon={"close"}
                        size={"small"}
                        className={"ux-red"}
                        onClick={event => {
                            Ux.prevent(event);
                            Ex.rsVisible(reference, false)();
                        }}/>
            </Col>
        </Row>
    );

const renderPopover = (reference, jsxChildren, config = {}) => {
    config = Ux.clone(config);
    /*
     * overlayStyle 计算，主要针对 width
     */
    config.overlayStyle = {width: config.width};
    config.content = Ux.isFunction(jsxChildren) ? jsxChildren() : false;
    /*
     * 关闭按钮属性专用
     */
    config.title = jsxTitle(reference, config);
    return (
        <Popover {...config}/>
    );
}

const renderWindow = (reference, jsxChildren, config = {}) => {
    const {$submitting = false} = reference.props;
    config = Ux.clone(config);
    /*
     * 强制 Mask
     */
    config.maskClosable = false;
    config.destroyOnClose = true;        // 必须
    config.className = "web-dialog";     // 默认 Ux 中的窗口配置
    config.confirmLoading = $submitting; // 提交时的房重复提交
    config.cancelButtonProps = {
        loading: $submitting,
    };
    return (
        <Modal {...config}>
            {Ux.isFunction(jsxChildren) ? jsxChildren() : false}
        </Modal>
    );
}

const _jsxChildren = (reference, component = {}, attributes = {}) => {
    const {config = {}, Component} = component;
    if (Component) {
        const inherit = Ux.clone(attributes);
        inherit.rxClose = Ex.rsVisible(reference, false);
        return (
            <Component {...Ux.sorterObject(inherit)} config={config}/>
        );
    } else {
        console.error("未捕捉到组件！", component);
        return false;
    }
};

const _jsxDialog = (reference, dialog = {}, attributes = {}) => {
    const {config = {}, component = {}} = dialog;
    const {type = "WINDOW", ...rest} = config;
    let fnRender = null;
    if ("WINDOW" === type) {
        fnRender = renderWindow;
    } else {
        fnRender = renderPopover;
    }
    return fnRender(reference, () =>
        _jsxChildren(reference, component, attributes), rest);
};
export default (reference, {
    button = {},
    dialog = {},
    attributes = {},
}) => {
    return (
        <span>
            {_jsxDialog(reference, dialog, attributes)}
            <ExButton {...attributes} config={button}/>
        </span>
    );
}