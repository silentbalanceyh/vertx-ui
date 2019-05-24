import React from 'react';
import {Button} from 'antd';
import Ux from "ux";
import Fx from '../Fx';

class Component extends React.PureComponent {
    state = {
        $visible: false,
        $loading: false,
    };

    componentDidMount() {
        Fx.initDialog(this);
    }

    render() {
        const {$config = {}} = this.props;
        const {text, ...rest} = $config;
        Ux.dgDebug({
            props: this.props,
            state: this.state,
        }, "[Ex] IxOpButton：", "#454");
        return (
            <span>
                <Button {...rest} htmlType={"button"}
                        onClick={Fx.rxOpenDialog(this, $config)}/>
                {Fx.jsxDialog(this)}
            </span>
        );
    }
}

export default Component;