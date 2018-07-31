import React from 'react'
import Ux from 'ux';
import Op from './Op';

const {zero} = Ux;

@zero(Ux.rxEtat(require('./Cab.json'))
    .cab("UI.Demo.Filter")
    .state({
        $op: Op
    })
    .form().to()
)
class Component extends React.PureComponent {
    render() {
        return Ux.uiFieldForm(this, {
            $button: (reference, jsx) => {

                return false;
            }
        }, 1)
    }
}

export default Component