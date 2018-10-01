import React from 'react'
import Ux from 'ux'
import {PageCard} from 'web';

import Demo from './UI.Demo';

const {zero} = Ux;

@zero(Ux.rxEtat(require('./Cab'))
    .cab("UI.Demo.Index")
    .to()
)
class Component extends React.PureComponent {
    render() {
        return (
            <PageCard reference={this}>
                {Ux.auiTab(this)
                    .to(
                        <Demo {...this.props}/>
                    )}
            </PageCard>
        )
    }
}

export default Component