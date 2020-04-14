import React from 'react';
import {Button, Modal} from 'antd';
import Ux from 'ux';
import Ex from 'ex';
import Op from './yo';

const sexDialog = (reference) => {
    /*
     * 1. props.config 中的 $dialog 配置，静态
     * 2. props 中的修改配置，动态
     */
    const propIn = reference.props.$dialog;
    const stateIn = reference.state.$dialog;
    const config = stateIn ? Ux.clone(stateIn) : {};
    if (propIn) {
        const {$visible = false, $current = {}} = propIn;
        config.data = $current;
        config.visible = $visible;
    } else {
        config.visible = false;
    }
    return config;
}

export default (reference, render = () => false) => {
    const config = sexDialog(reference);
    const inherit = Ex.yoDynamic(reference);
    /* 数据处理 */
    inherit.data = config.data;
    return (
        <Modal {...config.dialog} visible={config.visible}
               onCancel={Op.onClose(reference)}
               footer={
                   <Button className={"ux-red"} icon={"stop"}
                           onClick={Op.onClose(reference)}>
                       {config.button}
                   </Button>
               }>
            {config.visible ? (render(inherit)) : false}
        </Modal>
    )
}