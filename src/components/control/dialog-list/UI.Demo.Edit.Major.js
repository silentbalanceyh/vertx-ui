import React from 'react'
import Ux from 'ux';
import Op from './Op';

const {zero} = Ux;

@zero(Ux.rxEtat(require('./Cab.json'))
    .cab("UI.Demo.Edit.Major")
    .bind(Op.Act)
    .raft(1)
    .form().to()
)
class Component extends React.PureComponent {

    render() {
        return Ux.uiFieldForm(this, {...Ux.ai2FormButton(Op.Act, true)}, 1)
    }
}

export default Component