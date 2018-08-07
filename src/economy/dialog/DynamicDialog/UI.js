import React from 'react'
import {Modal} from 'antd';

class Component extends React.PureComponent {

    render() {
        const {$dialog = {}, className = "", $visible = false, children} = this.props;
        return (
            <Modal {...$dialog} visible={$visible} className={className}>
                {children}
            </Modal>
        )
    }
}

export default Component;
