import React from 'react';
import {Icon} from 'antd';
import Op from './Op';

import Dialog from '../IxDialog/UI';
import Editor from '../IxEditorBatch/UI';
import Ux from "ux";

class Component extends React.PureComponent {
    state = {
        $visible: false,
        $loading: false,
    };

    componentDidMount() {
        Op.init(this);
    }

    render() {
        const {$config = {}, $editor = {}} = this.props;
        const {text, icon, ...rest} = $config;
        /* 窗口配置 */
        const {
            $visible = false,
            $loading = false,
            window,
            fnClose,
            fnSubmit, // 提交
        } = this.state;
        Ux.dgDebug({
            props: this.props,
            state: this.state,
        }, "[Ex] IxOpLink：", "#06c");
        return (
            <li key={`link-batch-${$config.key}`}>
                <a {...rest} onClick={Op.onOpen(this, $config)}>
                    {icon ? <Icon type={icon}/> : false}
                    {icon ? <span>&nbsp;&nbsp;</span> : false}
                    {text ? <span className={"text"}>{text}</span> : false}
                </a>
                {window ? (
                    <Dialog $visible={$visible} $loading={$loading}
                            $config={window} fnClose={fnClose}>
                        <Editor {...this.props}
                                fnClose={fnClose}
                                fnSubmit={fnSubmit}
                                config={$editor}/>
                    </Dialog>
                ) : false}
            </li>
        );
    }
}

export default Component;