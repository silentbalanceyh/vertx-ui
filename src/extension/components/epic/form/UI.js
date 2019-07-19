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
                表单管理
            </HelpCard>
        )
    }
}

export default Component