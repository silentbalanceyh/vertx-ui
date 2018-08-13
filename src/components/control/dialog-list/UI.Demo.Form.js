import React from 'react'
import Ux from 'ux';
import Op from './Op.Sub';
import {DialogList} from 'web';
import Form from './UI.Demo.Form.Sub';
import MajorForm from './UI.Demo.Form.Update'

const {zero} = Ux;

@zero(Ux.rxEtat(require('./Cab.json'))
    .cab("UI.Demo.Form").to()
)
class Component extends React.PureComponent {
    render() {
        return (
            <div>
                <MajorForm {...this.props}/>
                <DialogList {...this.props} reference={this}
                            rxDelete={Op.opSubDeletePost(this)}
                            $formAdd={Form} $formEdit={Form}/>
            </div>
        )
    }
}

export default Component