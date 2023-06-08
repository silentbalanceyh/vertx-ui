import React from 'react';
import {Drawer} from 'antd';
import Op from '../op';
import Cmd from "../command";
import __Zn from '../zero.uca.dependency';

export default (reference) => {
    const {$drawer, $setting = {}} = reference.state;
    const attrs = {};
    attrs.visible = !!$drawer;
    attrs.onClose = Op.rxSettingClose(reference);
    attrs.maskClosable = false;
    attrs.destroyOnClose = true;
    attrs.key = $drawer;

    const fnContent = Cmd.Command[$drawer];
    const {className = ""} = $setting;
    return (
        (<Drawer {...attrs} rootClassName={className}>
            {__Zn.isFunction(fnContent) ? fnContent(reference) : `Not Ready ${$drawer}`}
        </Drawer>)
    );
}