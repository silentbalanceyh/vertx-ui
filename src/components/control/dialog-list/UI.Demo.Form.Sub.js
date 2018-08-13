import React from 'react'
import Ux from 'ux';
import Op from './Op.Sub';

const {zero} = Ux;

@zero(Ux.rxEtat(require('./Cab.json'))
    .cab("UI.Demo.Form.Sub")
    .bind(Op)
    .form().to()
)
class Component extends React.PureComponent {
    render() {
        return Ux.uiFieldForm(this, {}, 1)
    }
}

export default Component