import React from 'react'
import Ux from 'ux';
import Op from './Op';
import {DialogList} from 'web';
import Form from './UI.Demo.Form.Sub';
import MajorForm from './UI.Demo.Form.Update'

const {zero} = Ux;

@zero(Ux.rxEtat(require('./Cab.json'))
    .cab("UI.Demo.Form")
    .bind(Op).to()
)
class Component extends React.PureComponent {
    render() {
        return (
            <div>
                <MajorForm {...this.props}/>
                <DialogList {...this.props} reference={this}
                            $formAdd={Form} $formEdit={Form}/>
            </div>
        )
    }
}

export default Component