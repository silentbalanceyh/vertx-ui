import React from 'react'
import {_zero} from "../../../_internal";
import {DataLabor} from 'entity';
import Ux from 'ux';

@_zero({
    "i18n.cab": require('../Cab.json'),
    "i18n.name": "UI.App",
    state: {},
    connect: {
        s2p: state => DataLabor.createOut(state)
            .rework({
                "grid": ["query"]
            })
            .rinit(["query"])
            .to(),
    }
})
class Component extends React.PureComponent {
    componentDidMount() {
        const config = Ux.D.datumQuery(this);
        Ux.G.drawTree("g6Query", config);
    }

    render() {
        return (<div id={"g6Query"}/>)
    }
}

export default Component