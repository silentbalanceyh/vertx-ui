import React from 'react'
import Ux from 'ux';
import {_zero} from "../../_internal";
import DrawerControls from './drawer';
import {Drawer} from 'antd';

/**
 * 抽屉主入口，用于帮助Zero UI专用调试工具入口
 */
@_zero({
    "i18n.cab": require('./Cab.json'),
    "i18n.name": "UI.Tool"
})
class Component extends React.PureComponent {
    render() {
        const {$drawer = {}, reference} = this.props;
        const kv = {};
        Object.keys($drawer).filter(key => $drawer[key])
            .forEach(key => {
                kv.key = key.replace(/\$/g, '');
                kv.visible = $drawer[key];
            });
        if (kv.visible) {
            const drawer = Ux.fromHoc(this, "drawer");
            const Component = DrawerControls[kv.key];
            const drawerConfig = drawer[kv.key] ? drawer[kv.key] : {};
            const state = {};
            state[`$${kv.key}`] = false;
            return (
                <Drawer {...drawerConfig} visible={kv.visible}
                        onClose={() => reference.setState(state)}
                        height={480} placement={"bottom"}>
                    {Component ? (<Component {...this.props}/>) : false}
                </Drawer>
            )
        } else return false;
    }
}

export default Component