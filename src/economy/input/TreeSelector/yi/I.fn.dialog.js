import Ux from "ux";
import U from "underscore";
import {Button} from "antd";
import React from "react";

const onConfirm = (reference = {}, config = {}) => (event) => {
    Ux.prevent(event);
    const {$select} = reference.state;
    const ref = Ux.onReference(reference, 1);
    // 判断ListSelector中的选中项，状态中的$select是否存在
    if ($select) {
        /*
         * Linker取值
         */
        const values = Ux.writeLinker({}, config, () => $select);
        if (!Ux.isEmpty(values)) {
            // 调用Form数据处理Linker
            Ux.formHits(ref, values);
            // 执行Linker过后的回调
            const {fnCallback} = config;
            if (U.isFunction(fnCallback)) {
                fnCallback($select);
            }
            // onChange 保证表单的 isTouched
            const {onChange, id} = reference.props;
            if (U.isFunction(onChange)) {
                const changeValue = values[id];
                onChange(changeValue);
            }
        }
        // 关闭窗口
        reference.setState({$visible: false});
    } else {
        // 未选中时若包含了验证，则提示验证信息
        Ux.E.fxTerminal(!config.validation, 10080, config.validation);
        if (config.validation) {
            // TODO: showError 后期重写
            Ux.messageFailure(config.validation);
            // Dialog.showError(ref, config.validation);
        }
    }
};
const onClose = (reference = {}, show = false) => (event) => {
    Ux.prevent(event);
    // 设置窗口开关事件
    let state = {};
    state.$visible = show;
    // 重置页面数据
    state.$page = 1;
    state = Ux.clone(state);
    reference.setState(state);
};
export default (reference, config = {}) => {
    const dialog = Ux.aiExprWindow(config.window);
    // Footer关闭
    dialog.footer = (
        <Button.Group>
            <Button icon="check"
                    className="ux-success"
                    onClick={onConfirm(reference, config)}>{dialog.okText}</Button>
            <Button icon="close"
                    type="danger"
                    onClick={onClose(reference, false)}>{dialog.cancelText}</Button>
        </Button.Group>
    );
    dialog.onCancel = onClose(reference, false);
    return dialog;
};