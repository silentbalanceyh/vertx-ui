import React from 'react';
import {Drawer} from 'antd';
import Op from '../op';

export default (reference) => {
    const {$drawer} = reference.state;
    const attrs = {};
    attrs.visible = !!$drawer;
    attrs.onClose = Op.rxSettingClose(reference);
    attrs.maskClosable = false;
    return (
        <Drawer {...attrs}>
            Setting
        </Drawer>
    )
}