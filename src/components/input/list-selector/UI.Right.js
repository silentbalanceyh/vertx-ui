import React from 'react'
import Ux from 'ux';
import Op from './Op';
import {PageCard} from 'web';

const {zero} = Ux;

@zero(Ux.rxEtat(require('./Cab.json'))
    .cab("UI.Right")
    .bind(Op)
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