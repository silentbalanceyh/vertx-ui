import React from 'react'
import {LoadingContent} from "web";
import {Form} from 'antd';
import Op from './Op';
import Ux from "ux";

class Component extends React.PureComponent {
    state = {
        $ready: false
    };

    componentDidMount() {
        Op.yiForm(this);
    }

    render() {
        const {$ready = false} = this.state;
        return $ready ? (
            Ux.uiFieldForm(this, {}, 1)
        ) : (<LoadingContent/>)
    }
}

export default Form.create({})(Component)