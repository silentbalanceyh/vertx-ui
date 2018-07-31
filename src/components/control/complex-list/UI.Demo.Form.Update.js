import React from 'react'
import Ux from 'ux';
import Op from './Op';

const {zero} = Ux;

@zero(Ux.rxEtat(require('./Cab.json'))
    .cab("UI.Demo.Form")
    .state({
        $op: Op
    })
    .form().to()
)
class Component extends React.PureComponent {
    render() {
        return Ux.uiFieldForm(this, {
            $button: (reference) => Ux.aiFormButton(reference, Op, true)
        }, 1)
    }
}

export default Component