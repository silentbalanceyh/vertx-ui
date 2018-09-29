import React from 'react'
import Ux from "ux";
import Op from "./Op.Act";

const {zero} = Ux;

@zero(Ux.rxEtat(require('./Cab.json'))
    .cab("UI.Dialog.Activity")
    .bind(Op.Activity).raft(2)
    .form().to()
)
class Component extends React.PureComponent {
    render() {
        return Ux.uiFieldForm(this, {}, 2)
    }
}

export default Component