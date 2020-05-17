import React from 'react';
import {component} from "web";
import Ux from "ux";
import Ex from "ex";
import IxOption from "../IxOption/UI";
import PageForm from './Web.Form';

/*
 * 自定义组件，编辑数据库Json
 */
@component({
    "i18n.cab": require("./Cab.json"),
    "i18n.name": "IxIntegration"
})
class Component extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = Ux.xtInitObject(props);
    }

    componentDidMount() {
        Ex.yiFormSegment(this);
    }

    render() {
        return Ex.xuiComplex(this, "IxIntegration")(PageForm, IxOption);
    }
}

export default Component