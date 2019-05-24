import React from 'react'
import Ux from "ux";
import {Popover} from 'antd';
import renderTitle from './UI.Title';

class Component extends React.PureComponent {
    render() {
        const {
            $config = {},
            $visible = false,
            children
        } = this.props;
        // 状态
        Ux.dgDebug({
            props: this.props,
            state: this.state,
        }, "[Ex] IxPopover：", "#c33");
        return (
            <Popover {...$config} visible={$visible}
                     overlayStyle={{width: $config.width}}
                     title={renderTitle(this, {
                         ...$config,
                     })}
                     content={children}/>
        );
    }
}

export default Component