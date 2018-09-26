import React from 'react'
import './Cab.less'
import {Modal} from 'antd';

class Component extends React.PureComponent {

    render() {
        const {$dialog = {}, className = "web-dynamic-dialog", $visible = false, children} = this.props;
        return (
            <Modal {...$dialog} visible={$visible} className={className}>
                {children}
            </Modal>
        )
    }
}

export default Component;
