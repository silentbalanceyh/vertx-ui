import React from 'react'
import {Button} from 'antd';
import Op from './Op';
import Ux from 'ux';

class Component extends React.PureComponent {

    componentDidMount() {
        const state = Op.initState(this);
        this.setState(state);
    }

    render() {
        return Ux.fxRender(this, () => {
            const {
                button = {},
                render
            } = this.state;
            // 按钮专用处理
            const {text, onClick, ...rest} = button;
            return (
                <span>
                    <Button {...rest} onClick={onClick(button)}>
                        {text ? text : ""}
                    </Button>
                    {render(this)}
                </span>
            );
        });
    }
}

export default Component