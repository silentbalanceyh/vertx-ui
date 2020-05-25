import React from 'react';
import Op from './op';
import Ux from 'ux';
import LoadingContent from '../../loading/LoadingContent/UI';
import {Form} from "antd";

class Component extends React.PureComponent {
    componentDidMount() {
        Op.yiForm(this);
    }

    render() {
        return Ux.xtReady(this,
            () => Ux.aiForm(this),
            {component: LoadingContent});
    }
}

export default Form.create({})(Component)