import React from 'react';
import {component} from "../../../_internal";
import UiForm from '../Web.Form';
import Ux from 'ux';

@component({
    "i18n.cab": require('../Cab.json'),
    "i18n.name": "UI.Layout",
})
class Component extends React.PureComponent {
    render() {
        /*
         * 配置处理
         */
        const {$inited = {}} = this.props;
        const config = Ux.fromHoc(this, "form");
        return (<UiForm config={{form: config}} $inited={$inited}/>);
    }
}

export default Component