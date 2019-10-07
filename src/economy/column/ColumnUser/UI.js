import React, {Fragment} from 'react';
import {Icon} from 'antd';
import Op from './Op';

class Component extends React.PureComponent {
    state = {};

    componentDidMount() {
        Op.yiUser(this);
    }

    render() {
        const {$ready = false, value = ""} = this.state;
        return $ready ? (
            <Fragment>
                <Icon {...Op.yoIcon(this)}/>
                &nbsp;&nbsp;
                {value}
            </Fragment>
        ) : (<Icon type={"loading"}/>);
    }
}

export default Component;