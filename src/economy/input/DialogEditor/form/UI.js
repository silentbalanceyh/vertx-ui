import React from 'react';
import Op from "./Op";
import Ux from "ux";
import LoadingContent from "../../../loading/LoadingContent/UI";
import {Form} from "antd";

class Component extends React.PureComponent {
    componentDidMount() {
        Op.yiFormPage(this);
    }

    render() {
        const {$inited = {}} = this.props;
        return Ux.xtReady(this, () => Ux.aiForm(this, $inited),
            {component: LoadingContent}
        )
    }
}

export default Form.create({})(Component)