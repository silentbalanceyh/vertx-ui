import React from 'react'
import Ux from 'ux'
import {Fn} from 'app';
import Demo from './UI.Demo';
import Desc from './UI.Desc';

const {zero} = Ux;

@zero(Ux.rxEtat(require('./Cab.json'))
    .cab("UI")
    .to()
)
class Component extends React.PureComponent {
    render() {
        const {$router} = this.props;
        return Fn.demoPage(this,
            <Demo reference={this} $router={$router}/>,
            <Desc/>
        )
    }
}

export default Component