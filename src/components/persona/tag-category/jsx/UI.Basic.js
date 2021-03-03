import React from 'react';
import Ux from 'ux';
import {Fn} from 'app';

@Ux.zero(Ux.rxEtat(require("../Cab"))
    .cab("UI.Basic")
    .to()
)
class Component extends React.PureComponent {

    render() {
        return Fn.jsxForm(this)
    }
}

export default Component