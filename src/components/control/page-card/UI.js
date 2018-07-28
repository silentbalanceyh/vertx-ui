import React from 'react'
import Ux from 'ux'
import {AttrTree, PageCard} from 'web';

const {zero} = Ux;

@zero(Ux.rxEtat(require('./Cab.json'))
    .cab("UI")
    .to()
)
class Component extends React.PureComponent {
    render() {
        return (
            <PageCard reference={this}>
                <AttrTree reference={this} $name={"PageCard"}/>
            </PageCard>
        )
    }
}

export default Component