import React from 'react'
import '../Cab.less'
import Ux from "ux";
import {Fn} from 'app';
import {AttrSetter} from "web";

const {zero} = Ux;

@zero(Ux.rxEtat(require('../Cab.json'))
    .cab("UI.Drawer")
    .to()
)
class Component extends React.PureComponent {
    render() {
        const ref = Ux.onReference(this, 2);
        return Fn.drawer(this, "$drawer", (
            <AttrSetter reference={ref}/>
        ))
    }
}

export default Component;