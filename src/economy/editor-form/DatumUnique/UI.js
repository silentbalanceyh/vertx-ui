import React from 'react';
import {component} from "../../_internal";
import Op from './op';

@component({
    "i18n.cab": require('./Cab.json'),
    "i18n.name": "UI",
})
class Component extends React.PureComponent {
    componentDidMount() {
        Op.yiPage(this);
    }

    render() {
        return (
            <div>
                Tpl
            </div>
        )
    }
}

export default Component