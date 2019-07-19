import React from 'react'
import Ux from 'ux';
import Op from './Op';

const {zero} = Ux;

@zero(Ux.rxEtat(require('./Cab.json'))
    .cab("UI.Form.Basic")
    .bind(Op)
    .form()
    .raft(2).to()
)
class Component extends React.PureComponent {
    render() {
        return Ux.uiFieldForm(this, {}, 2)
    }
}

export default Component