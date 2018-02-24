import React from 'react'
import { Modal } from 'antd';

class Component extends React.PureComponent {

    render() {
        const { $dialog = {}, $visible = false, children } = this.props;
        return (
            <Modal {...$dialog} visible={$visible}>
                {children}
            </Modal>
        )
    }
}

export default Component;
