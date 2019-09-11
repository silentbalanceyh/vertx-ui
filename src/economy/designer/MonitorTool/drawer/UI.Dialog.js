import React from 'react';
import {_zero} from "../../../_internal";
import {Dsl} from 'entity';
import Ux from "ux";
import EmptyContent from "../UI.Empty";

@_zero({
    "i18n.cab": require('../Cab.json'),
    "i18n.name": "UI.Pure",
    state: {},
    connect: {
        s2p: state => Dsl.createOut(state)
            .rework({
                "debug.active": ["dialog"]
            })
            .rinit(["dialog"])
            .to(),
    }
})
class Component extends React.PureComponent {
    componentDidMount() {
        const {$dialog} = this.props;
        if ($dialog.is()) {
            const config = Ux.D.datumTree($dialog.to());
            Ux.G.drawTree("g6Dialog", config);
        }
    }

    render() {
        const {$dialog} = this.props;
        if ($dialog.is()) {
            return (<div id={"g6Dialog"}/>);
        } else {
            return (<EmptyContent/>);
        }
    }
}

export default Component;