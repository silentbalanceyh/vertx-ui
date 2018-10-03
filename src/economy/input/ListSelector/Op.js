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
        <Button.Group>
            <Button icon="check"
                    className="ux-success"
                    onClick={Ux.xt2Select(reference, config)}>{dialog.okText}</Button>
            <Button icon="close"
                    type="danger"
                    onClick={Ux.xt2Dialog(reference, false)}>{dialog.cancelText}</Button>
        </Button.Group>
    );
    dialog.onCancel = Ux.xt2Dialog(reference, false);
    return dialog;
};
const getHoc = (reference = {}) => {
    const {config = {}} = reference.props;
    // 核心配置处理
    const onClick = Ux.xt2Loading(reference, config);
    const dialog = getDialog(reference, config);
    const columns = Ux.uiTableColumn(reference, config.table.columns);
    const rowSelection = Ux.xtSelection(reference);
    return {
        onClick, dialog, ready: true,
        table: {columns, rowSelection}
    };
};
export default {
    getDefault,
    getDialog,
    getHoc,
};