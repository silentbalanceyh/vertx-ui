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
        const {config = {}} = this.props;
        const {icon = true} = config;
        return $ready ? (
            <Fragment>
                {icon ? (<Icon {...Op.yoIcon(this)}/>) : false}
                &nbsp;&nbsp;
                {value}
            </Fragment>
        ) : (<Icon type={"loading"}/>);
    }
}

export default Component;