import {Modal} from "antd";
import React from "react";
import Ux from 'ux';
import U from 'underscore';

export default (reference, jsxChildren, config = {}) => {
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
            {U.isFunction(jsxChildren) ? jsxChildren() : false}
        </Modal>
    );
}