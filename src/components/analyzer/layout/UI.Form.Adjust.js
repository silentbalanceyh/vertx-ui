import React from 'react'
import Ux from 'ux';
import Op from './Op';
import {Fn} from 'app';

const {zero} = Ux;

@zero(Ux.rxEtat(require('./Cab.json'))
    .cab("UI.Form.Adjust")
    .bind(Op)
    .form().to()
)
class Component extends React.PureComponent {
    render() {
        return (
            Fn.demoSingle(this,
                Ux.uiFieldForm(this, {...Ux.ai2FormButton(Op, true)}, 4)
            )
        )
    }
}

export default Component