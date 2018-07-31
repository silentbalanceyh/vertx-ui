import React from 'react'
import Ux from 'ux'
import {AttrTree} from 'web';

const {zero} = Ux;

@zero(Ux.rxEtat(require('./Cab.json'))
    .cab("UI.Desc")
    .to()
)
class Component extends React.PureComponent {
    render() {
        return (
            <AttrTree reference={this} $name={"HelpCard"}/>
        )
    }
}

export default Component