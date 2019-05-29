import React from 'react'
import Ux from 'ux';

const {zero} = Ux;

@zero(Ux.rxEtat(require('./Cab.json'))
    .cab("UI.Demo.Filter")
    .raft(1)
    .form().to()
)
class Component extends React.PureComponent {
    render() {
        return Ux.uiFieldFilter(this, {...Ux.Ex.ai2FilterButton()}, 1)
    }
}

export default Component