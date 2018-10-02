import {Button} from "antd";
import React from "react";
import Ux from 'ux';

const getDefault = () => ({
    $visible: false,
    $loading: false,
    $data: [],
    $select: undefined,
});
const getDialog = (reference, config = {}) => {
    const dialog = Ux.aiExprWindow(config.window);
    // Footer关闭
    dialog.footer = (
        <span>
            <Button icon="check" className="ux-success"
                    onClick={Ux.xt2Select(reference, config)}>{dialog.okText}</Button>
            <Button icon="close" type="danger"
                    onClick={Ux.xt2Dialog(reference, false)}>{dialog.cancelText}</Button>
        </span>
    );
    dialog.onCancel = Ux.xt2Dialog(reference, false);
    return dialog;
};
export default {
    getDefault,
    getDialog
}