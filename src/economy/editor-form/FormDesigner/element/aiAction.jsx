import React from 'react';
import {component} from "../../../_internal";
import {Form} from "antd";
import Sd from './aiShared';

@component({
    "i18n.cab": require('./Cab.json'),
    "i18n.name": "aiAction",
})
class Component extends React.PureComponent {
    componentDidMount() {
        Sd.yiComponent(this, {
            id: "SubForm-Setting-aiAction",
            renders: {
                serverSource: Sd.yoRenders.serverSource,
                server1Source: Sd.yoRenders.server1Source,
            }
        });
    }

    render() {
        const {$inited = {}} = this.props;
        return Sd.yoComponent(this, $inited);
    }
}

export default Form.create({})(Component)