import React from 'react'
import Ux from "ux";
import {HelpCard} from "web";

const {zero} = Ux;

@zero(Ux.rxEtat(require('./Cab.json'))
    .cab("UI")
    .to()
)
class Component extends React.PureComponent {
    render() {
        return (
            <HelpCard reference={this}>
            </HelpCard>
        )
    }
}

export default Component