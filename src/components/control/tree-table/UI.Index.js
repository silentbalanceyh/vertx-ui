import React from 'react'
import Ux from 'ux'
import {PageCard} from 'web';

import Demo from './UI.Demo';
import Demo1 from './UI.Demo1'

const {zero} = Ux;

@zero(Ux.rxEtat(require('./Cab'))
    .cab("UI.Index")
    .to()
)
class Component extends React.PureComponent {
    render() {
        return (
            <PageCard reference={this}>
                {Ux.auiTab(this)
                    .to(
                        <Demo {...this.props}/>,
                        <Demo1 {...this.props}/>
                    )}
            </PageCard>
        )
    }
}

export default Component