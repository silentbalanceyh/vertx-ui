import React from 'react'
import Ux from 'ux';
import Op from './Op';
import {DialogList} from 'web';
import Form from './UI.Demo.Form.Sub';

const {zero} = Ux;

@zero(Ux.rxEtat(require('./Cab.json'))
    .cab("UI.Demo.Form")
    .bind(Op)
    .form().to()
)
class Component extends React.PureComponent {
    render() {
        return (
            <div>
                {Ux.uiFieldForm(this, {...Ux.ai2FormButton(Op, true)}, 1)}
                <DialogList {...this.props} reference={this}
                            $formAdd={Form} $formEdit={Form}/>
            </div>
        )
    }
}

export default Component