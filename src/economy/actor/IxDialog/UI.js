import React from 'react';
import {Modal} from 'antd';

class Component extends React.PureComponent {
    render() {
        const {
            $config = {},
            $visible = false,
            $loading = false,
            children
        } = this.props;
        // 状态
        const status = {};
        if ($visible) {
            status.confirmLoading = $loading;
            status.cancelButtonProps = {
                loading: $loading,
            }
        }
        return (
            <Modal {...$config}
                   visible={$visible}
                   className={"web-dialog"}
                   {...status}>
                {children}
            </Modal>
        );
    }
}

export default Component;