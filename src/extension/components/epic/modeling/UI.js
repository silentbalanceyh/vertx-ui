import React from 'react'
import Ux from "ux";
import {PageCard } from 'web';
const {zero} = Ux;

@zero(Ux.rxEtat(require('./Cab.json'))
    .cab("UI")
    .to()
)

class Component extends React.PureComponent {
    render() {
        return (
            <PageCard reference={this}>
                {Ux.auiTab(this)
                    .mount("tabPosition", "left")
                    .mount("size", "small")
                    .to()}
            </PageCard>
        )
    }
}

export default Component