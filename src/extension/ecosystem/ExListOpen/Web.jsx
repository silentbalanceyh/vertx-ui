import {Modal} from "antd";
import React from 'react';
import Ux from 'ux';
import Ex from 'ex';

export default {
    jsxExtra: (reference) => {
        const {$extra = []} = reference.state;
        return $extra.map(button => {
            const {onClick, ...rest} = button;
            const config = Ux.clone(rest);
            if (Ux.isFunction(onClick)) {
                const fnClick = onClick(button, null);
                return Ux.aiAnchor(config, fnClick);
            } else {
                // 这个时候什么都不渲染出来
                return false;
            }
        })
    },
    jsxWindow: (reference) => {
        const {$dialog, $inited, $visible = false} = reference.state;
        if ($dialog) {
            const {component = "", ...dialogConfig} = $dialog;
            const {$form = {}} = reference.props;
            const Component = $form[component];
            const inherit = Ex.yoAmbient(reference);
            inherit.data = $inited;
            return (
                <Modal {...dialogConfig} visible={$visible}>
                    {Component ? (
                        <Component {...inherit}/>
                    ) : false}
                </Modal>
            )
        } else return false;
    }
}