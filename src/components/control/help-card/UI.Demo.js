import React from 'react'
import Ux from "ux";
import {HelpCard} from 'web';

const {zero} = Ux;

@zero(Ux.rxEtat(require('./Cab.json'))
    .cab("UI.Demo")
    .to()
)
class Component extends React.PureComponent {

    render() {
        const {children, $status = {}} = this.props;
        return (
            <HelpCard reference={this} {...$status}>
                {children}
            </HelpCard>
        )
    }
}

export default Component