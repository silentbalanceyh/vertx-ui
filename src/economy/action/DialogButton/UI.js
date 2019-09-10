import React from 'react';
import {Button} from 'antd';
import Op from './Op';
import Ux from 'ux';

class Component extends React.PureComponent {

    componentDidMount() {
        const state = Op.initState(this);
        this.setState(state);
    }

    render() {
        return Ux.xtRender(this, () => {
            const {
                button = {},
                render
            } = this.state;
            // 按钮专用处理
            const {text, onClick, ...rest} = button;
            // 是否禁用
            const {$disabled = false} = this.props;
            const attrs = {disabled: $disabled};
            return (
                <span>
                    <Button {...rest} onClick={onClick(button)} {...attrs}>
                        {text ? text : ""}
                    </Button>
                    {render(this)}
                </span>
            );
        });
    }
}

export default Component;