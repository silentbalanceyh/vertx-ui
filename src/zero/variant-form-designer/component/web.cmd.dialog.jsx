import Cmd from "../command";
import {Modal} from "antd";
import React from 'react';
import __Zn from '../zero.uca.dependency';

export default (reference, item = {}) => {
    if (item.window) {
        const {$window, $visible = false} = reference.state;
        if ($window && $window === item.key) {
            const window = __Zn.fromHoc(reference, "window");
            let dialog = window[$window];
            if (dialog) {
                const modelConfig = __Zn.configDialog(reference, dialog);
                const fnContent = Cmd.Command[$window];
                modelConfig.onCancel = (event) => {
                    // reference.?etState({
                    //     $visible: false,
                    //     $window: undefined,
                    //     $forbidden: false,
                    // });
                    __Zn.of(reference).in({
                        // $visible: false,
                        $window: undefined,
                        $forbidden: false,
                    }).hide().done()
                }
                const fnFooter = Cmd.CommandFooter[item.key];
                if (__Zn.isFunction(fnFooter)) {
                    modelConfig.footer = fnFooter(reference, item, modelConfig);
                }
                return (
                    <Modal key={item.key} {...modelConfig} open={$visible}>
                        {$visible ? (
                            __Zn.isFunction(fnContent) ?
                                fnContent(reference) :
                                `窗口子组件丢失 ${item.key}`
                        ) : false}
                    </Modal>
                )
            } else {
                console.error(`窗口配置丢失：${$window}`)
                return false;
            }
        } else return false;
    } else return false;
}