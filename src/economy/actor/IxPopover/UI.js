import React from 'react'
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
        Ux.dgDebug({
            props: this.props,
            state: this.state,
        }, "[Ex] IxPopover：", "#c33");
        return (
            <div>2019-05-23</div>
        )
    }
}

export default Component