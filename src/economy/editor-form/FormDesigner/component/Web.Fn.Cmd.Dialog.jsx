import Ux from 'ux';
import Cmd from "../command";
import {Modal} from "antd";
import React from 'react';

export default (reference, item = {}) => {
    if (item.window) {
        const {$window, $visible = false} = reference.state;
        if ($window) {
            const window = Ux.fromHoc(reference, "window");
            let dialog = window[$window];
            if (dialog) {
                const modelConfig = Ux.configDialog(reference, dialog);
                const fnContent = Cmd.Command[$window];
                modelConfig.onCancel = (event) => {
                    reference.setState({
                        $visible: false,
                        $window: undefined,
                        $forbidden: false,
                    });
                }
                return (
                    <Modal key={item.key} {...modelConfig} visible={$visible}>
                        {Ux.isFunction(fnContent) ? fnContent(reference) :
                            `Dialog child miss ${item.key}`}
                    </Modal>
                )
            } else return false;
        } else return false;
    } else return false;
}