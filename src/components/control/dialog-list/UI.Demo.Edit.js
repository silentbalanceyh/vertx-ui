import React from 'react'
import Ux from 'ux';
import Op from './Op';
import {DialogList} from 'web';
import Form from './UI.Demo.Dialog';
import MajorForm from './UI.Demo.Edit.Major'

const {zero} = Ux;

@zero(Ux.rxEtat(require('./Cab.json'))
    .cab("UI.Demo.Form")
    .to()
)
class Component extends React.PureComponent {
    render() {
        return (
            <div>
                <MajorForm {...this.props}/>
                <DialogList {...this.props} reference={this}
                            rxDelete={Op.opDeletePost(this)}
                            $formAdd={Form} $formEdit={Form}/>
            </div>
        )
    }
}

export default Component