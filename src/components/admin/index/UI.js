import React from 'react'
import Ux from 'ux';

const {zero} = Ux;

@zero(Ux.rxEtat(require('./Cab.json'))
    .cab("UI")
    .to()
)
class Component extends React.PureComponent {
    render() {
        return (<div>Test</div>)
    }
}

export default Component