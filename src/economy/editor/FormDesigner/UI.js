import React from 'react';
import './Cab.less';
import {component} from "../../_internal";

@component({
    "i18n.cab": require('./Cab.json'),
    "i18n.name": "UI",
})
class Component extends React.PureComponent {
    render() {
        return (
            <div className={"web-form-designer"}>
                <div className={"toolbar"}>

                </div>
            </div>
        )
    }
}

export default Component