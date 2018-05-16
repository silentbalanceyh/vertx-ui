import React from 'react'
import Ux from 'ux';
import {TitleCard} from "web";
import {Taper} from 'environment';

import Filter from './UI.Filter';
import List from './UI.List';

const {zero, Logger} = Ux;

@zero({
    connect: {
        s2p: state => Ux
            .dataIn(state)
            .rework({datum: ["data"]})
            .rinit(["data"])
            .to(),
        d2p: {
            fnOut: Taper.fnFlush
        }
    },
    "i18n.name": "UI",
    "i18n.cab": require("./Cab.json"),
    logger: Logger.page,
})
class Component extends React.PureComponent {
    render() {
        return (
            <TitleCard reference={this}>
                <Filter fnOut={this.props.fnOut}/>
                <List fnOut={this.props.fnOut}
                      {...Ux.toProp(this.props, "data", "app")}/>
            </TitleCard>
        )
    }
}

export default Component