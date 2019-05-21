import React from 'react'
import {Drawer} from 'antd';

class Component extends React.PureComponent {
    render() {
        const {$visible = false, $config = {}} = this.props;
        console.info($visible);
        return (
            <Drawer {...$config} visible={$visible}>

            </Drawer>
        )
    }
}

export default Component