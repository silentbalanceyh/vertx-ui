import React from 'react';
import {Icon} from 'antd';
import Op from './Op';
import Fx from '../Fx';
import Editor from '../IxEditorBatch/UI';
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
        const {$config = {}, $editor = {}} = this.props;
        const {text, icon, ...rest} = $config;
        /* 窗口配置 */
        const {
            fnClose,
            fnSubmit, // 提交
        } = this.state;
        Ux.dgDebug({
            props: this.props,
            state: this.state,
        }, "[Ex] IxOpLink：", "#06c");
        return (
            <li key={`link-batch-${$config.key}`}>
                <a {...rest} onClick={Fx.rxOpenDialog(this, $config, Op.onOk)}>
                    {icon ? <Icon type={icon}/> : false}
                    {icon ? <span>&nbsp;&nbsp;</span> : false}
                    {text ? <span className={"text"}>{text}</span> : false}
                </a>
                {Fx.jsxDialog(this, (
                    <Editor {...this.props}
                            fnClose={fnClose}
                            fnSubmit={fnSubmit}
                            config={$editor}/>
                ))}
            </li>
        );
    }
}

export default Component;