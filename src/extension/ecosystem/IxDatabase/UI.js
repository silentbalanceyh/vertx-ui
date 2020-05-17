import React from 'react';
import Ux from 'ux';
import {component} from 'web';
import Ex from 'ex';
import PageForm from './Web.Form';
import IxOption from '../IxOption/UI';

/*
 * 自定义组件，编辑数据库Json
 */
@component({
    "i18n.cab": require("./Cab.json"),
    "i18n.name": "IxDatabase"
})
class Component extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = Ux.xtInitFormat(props);
    }

    componentDidMount() {
        Ex.yiFormSegment(this);
    }

    render() {
        return Ex.xuiComplex(this, "IxDatabase")(PageForm, IxOption);
    }
}

export default Component