import React from 'react';
import {Button, Tooltip} from 'antd';
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
        const {text, icon, key, type} = $config;
        const rest = {icon, key, type};
        Ux.dgDebug({
            props: this.props,
            state: this.state,
        }, "[Ex] IxOpButton：", "#09c");
        return (
            <span>
                {Fx.jsxDialog(this)}
                <Tooltip title={text}>
                    <Button {...rest} htmlType={"button"}
                            onClick={Fx.rxOpenDialog(this, $config)}/>
                </Tooltip>
            </span>
        );
    }
}

export default Component;