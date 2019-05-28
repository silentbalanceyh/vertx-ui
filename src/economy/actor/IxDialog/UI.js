import React from 'react';
import {Modal} from 'antd';
import Ux from "ux";

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
            };
        }
        Ux.dgDebug({
            props: this.props,
            state: this.state,
        }, "[Ex] IxDialog：", "#c33");
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