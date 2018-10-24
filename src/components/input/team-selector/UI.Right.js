import React from 'react'
import Ux from 'ux';
import Op from './Op';
import {PageCard} from 'web';
import Mock from './mock'

const {zero} = Ux;

@zero(Ux.rxEtat(require('./Cab.json'))
    .cab("UI.Right")
    .bind(Op)
    .mock(Mock)
    .raft(2)
    .form().to()
)
class Component extends React.PureComponent {
    render() {
        return (
            <PageCard reference={this}>
                {Ux.uiFieldForm(this, {}, 2)}
            </PageCard>
        )
    }
}

export default Component