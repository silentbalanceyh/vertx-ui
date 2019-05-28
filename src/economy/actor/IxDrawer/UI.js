import React from 'react';
import {Drawer} from 'antd';
import Ux from "ux";

class Component extends React.PureComponent {
    render() {
        const {$visible = false, $config = {}, children} = this.props;
        Ux.dgDebug({
            props: this.props,
            state: this.state,
        }, "[Ex] IxDrawer：", "#c33");
        return (
            <Drawer {...$config} visible={$visible}>
                {children}
            </Drawer>
        );
    }
}

export default Component;