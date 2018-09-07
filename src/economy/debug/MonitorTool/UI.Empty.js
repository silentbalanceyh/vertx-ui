import React from 'react'
import {Alert} from 'antd';
import Ux from 'ux';
import {_zero} from "../../_internal";

@_zero({
    "i18n.cab": require('./Cab.json'),
    "i18n.name": "UI"
})
class Component extends React.PureComponent {
    render() {
        const message = Ux.fromPath(this, "info", "empty");
        return (
            <Alert message={message} type={"error"}/>
        )
    }
}

export default Component