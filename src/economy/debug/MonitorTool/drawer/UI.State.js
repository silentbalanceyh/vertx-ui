import React from 'react'
import {_zero} from "../../../_internal";
import {DataLabor} from 'entity';
import Ux from "ux";

@_zero({
    "i18n.cab": require('../Cab.json'),
    "i18n.name": "UI.Pure",
    state: {},
    connect: {
        s2p: state => DataLabor.createOut(state)
            .rework({
                "debug.active": ["form"]
            })
            .rinit(["form"])
            .to(),
    }
})
class Component extends React.PureComponent {
    componentDidMount() {
        const {$form} = this.props;
        if ($form.is()) {
            const config = Ux.D.datumTree($form.to());
            Ux.G.drawTree("g6Form", config);
        }
    }

    render() {
        return (<div id={"g6Form"}/>)
    }
}

export default Component