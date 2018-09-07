import React from 'react'
import Ux from 'ux';
import Op from './Op';

const {zero} = Ux;

@zero(Ux.rxEtat(require('./Cab.json'))
    .cab("UI.Demo.Form.Add")
    .bind(Op)
    .raft(1)
    .form().to()
)
class Component extends React.PureComponent {
    render() {
        return Ux.uiFieldForm(this, {...Ux.ai2FormButton(Op)}, 1)
    }
}

export default Component