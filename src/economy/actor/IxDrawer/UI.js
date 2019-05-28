import React from 'react';
import {Drawer} from 'antd';
import Ux from "ux";
import './Cab.less';

class Component extends React.PureComponent {
    render() {
        const {$visible = false, $config = {}, children} = this.props;
        Ux.dgDebug({
            props: this.props,
            state: this.state,
        }, "[Ex] IxDrawer：", "#c33");
        return (
            <Drawer {...$config} visible={$visible} className={"ex-drawer"}>
                {children}
            </Drawer>
        );
    }
}

export default Component;