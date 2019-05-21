import React from 'react';
import {Modal} from 'antd';

class Component extends React.PureComponent {
    render() {
        const {$config = {}, $visible = false, children} = this.props;
        return (
            <Modal {...$config} visible={$visible} className={"web-dialog"}>
                {children}
            </Modal>
        );
    }
}

export default Component;