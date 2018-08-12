import React from 'react'
import Ux from 'ux';
import Op from './Op';
import {DialogList} from 'web';

const {zero} = Ux;

@zero(Ux.rxEtat(require('./Cab.json'))
    .connect(state => Ux.dataIn(state)
        .rework({
            list: ["items"]
        })
        .rinit(["items"])
        .to()
    )
    .cab("UI.Demo.Form")
    .bind(Op)
    .form().to()
)
class Component extends React.PureComponent {
    render() {
        const {$inited = {}} = this.props;
        return (
            <div>
                {Ux.uiFieldForm(this, {...Ux.ai2FormButton(Op, true)}, 1)}
                <DialogList {...this.props} $inited={$inited}/>
            </div>
        )
    }
}

export default Component