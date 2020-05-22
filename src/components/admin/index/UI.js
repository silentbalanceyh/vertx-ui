import React from 'react'
import './Cab.less'
import Ux from 'ux';
import {PageCard} from 'web';

const {zero} = Ux;

@zero(Ux.rxEtat(require('./Cab.json'))
    .cab("UI")
    .to()
)
class Component extends React.PureComponent {
    render() {
        return (
            <div className={"zui-main"}>
                <PageCard reference={this}>
                    
                </PageCard>
            </div>
        )
    }
}

export default Component