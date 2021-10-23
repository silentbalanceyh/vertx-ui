import React from 'react'
import Ux from 'ux';

const {zero} = Ux;

@zero(Ux.rxEtat(require('./Cab.json'))
    .cab('UI.Page.Arch')
    .to()
)
class Component extends React.PureComponent {
    render() {
        return (
            <div>2018/9/9</div>
        )
    }
}

export default Component