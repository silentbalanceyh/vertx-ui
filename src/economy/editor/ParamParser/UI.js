import React from 'react';

import {component} from "../../_internal";

@component({
    "i18n.cab": require('./Cab.json'),
    "i18n.name": "UI",
})
class Component extends React.PureComponent {
    render() {
        return (
            <div>
                Tpl
            </div>
        )
    }
}

export default Component