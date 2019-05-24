import React from 'react';
import {Icon} from 'antd';
import Op from './Op';
import Fx from '../Fx';
import Ux from "ux";

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
        const {text, icon} = $config;
        /* 窗口配置 */
        Ux.dgDebug({
            props: this.props,
            state: this.state,
        }, "[Ex] IxOpLink：", "#06c");
        return (
            <li key={`link-batch-${$config.key}`}>
                <a onClick={Fx.rxOpenDialog(this, $config, Op.onOk)}>
                    {icon ? <Icon type={icon}/> : false}
                    {icon ? <span>&nbsp;&nbsp;</span> : false}
                    {text ? <span className={"text"}>{text}</span> : false}
                </a>
                {/* 全部统一处理 */}
                {Fx.jsxDialog(this)}
            </li>
        );
    }
}

export default Component;