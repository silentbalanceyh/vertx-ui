import React from 'react';
import {component} from "../../../_internal";

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
        return false;
    }
}

export default Component