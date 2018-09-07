import React from 'react'
import {_zero} from "../../../_internal";
import {DataLabor} from 'entity';
import Ux from "ux";
import EmptyContent from '../UI.Empty';

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
        const {$form} = this.props;
        if ($form.is()) {
            return (<div id={"g6Form"}/>)
        } else {
            return (<EmptyContent/>)
        }

    }
}

export default Component