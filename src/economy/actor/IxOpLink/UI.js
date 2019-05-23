import React from 'react';
import {Icon} from 'antd';
import Op from './Op';

import Dialog from '../IxDialog/UI';
import Editor from '../IxEditorBatch/UI';

class Component extends React.PureComponent {
    state = {
        visible: false
    };

    componentDidMount() {
        Op.init(this);
    }

    render() {
        const {$config = {}, $editor = {}} = this.props;
        const {text, icon, ...rest} = $config;
        /* 窗口配置 */
        const {visible = false, window, fnClose} = this.state;
        return (
            <li key={`link-batch-${$config.key}`}>
                <a {...rest} onClick={Op.onOpen(this, $config)}>
                    {icon ? <Icon type={icon}/> : false}
                    {icon ? <span>&nbsp;&nbsp;</span> : false}
                    {text ? <span className={"text"}>{text}</span> : false}
                </a>
                {window ? (
                    <Dialog $visible={visible} $config={window} fnClose={fnClose}>
                        <Editor {...this.props} fnClose={fnClose} config={$editor}/>
                    </Dialog>
                ) : false}
            </li>
        );
    }
}

export default Component;