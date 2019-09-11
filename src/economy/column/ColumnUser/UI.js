import React, {Fragment} from 'react';
import {Icon} from 'antd';
import Op from './Op';

class Component extends React.PureComponent {
    state = {};

    componentDidMount() {
        Op.yiUser(this);
    }

    render() {
        const {$ready = false, value = "", $system = true} = this.state;
        return $ready ? (
            <Fragment>
                <Icon type={$system ? "setting" : "user"} style={{
                    color: "#CD2990",   // 默认颜色
                    fontSize: 16
                }}/>
                &nbsp;&nbsp;
                {value}
            </Fragment>
        ) : (<Icon type={"loading"}/>);
    }
}

export default Component;