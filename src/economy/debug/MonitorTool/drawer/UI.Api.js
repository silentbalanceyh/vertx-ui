import React from 'react';
import Ux from 'ux';
import {_zero} from "../../../_internal";

@_zero({
    "i18n.cab": require('../Cab.json'),
    "i18n.name": "UI.Pure",
    state: {},
})
class Component extends React.PureComponent {
    componentDidMount() {
        const {$router} = this.props;
        if ($router) {
            const config = Ux.D.datumPointer($router.path());
            Ux.G.drawTree("g6Pointer", config);
        }
    }

    render() {
        return (<div id={"g6Pointer"}/>);
    }
}

export default Component;