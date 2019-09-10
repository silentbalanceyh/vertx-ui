import React from 'react';
import {_zero} from "../../../_internal";
import {Dsl} from 'entity';
import Ux from 'ux';
import EmptyContent from "../UI.Empty";

@_zero({
    "i18n.cab": require('../Cab.json'),
    "i18n.name": "UI.Pure",
    state: {},
    connect: {
        s2p: state => Dsl.createOut(state)
            .rework({
                "debug.active": ["sub"]
            })
            .rinit(["sub"])
            .to(),
    }
})
class Component extends React.PureComponent {
    componentDidMount() {
        const {$sub} = this.props;
        if ($sub.is()) {
            const config = Ux.D.datumTree($sub.to());
            Ux.G.drawTree("g6Sub", config);
        }
    }

    render() {
        const {$sub} = this.props;
        if ($sub.is()) {
            return (
                <div id={"g6Sub"}/>
            );
        } else {
            return (<EmptyContent/>);
        }
    }
}

export default Component;