import React from 'react'
import Ux from 'ux';
import FormStandard from './UI.Form.Standard'
import FormAdjust from './UI.Form.Adjust'
import FormAdjustWidth from './UI.Form.AdjustWidth'
import AjdustBar from './UI.Adjust.Bar';
import {PageCard} from 'web';

const {zero} = Ux;

@zero(Ux.rxEtat(require('./Cab.json'))
    .cab('UI')
    .state({
        window: 100
    })
    .to()
)
class Component extends React.PureComponent {
    render() {
        const {window} = this.state;
        return this.state ? (
            <PageCard reference={this}>
                <AjdustBar reference={this} $window={window}/>
                {Ux.auiTab(this).to(
                    <FormAdjustWidth reference={this}/>,
                    <FormAdjust reference={this}/>,
                    <FormStandard reference={this}/>
                )}
            </PageCard>
        ) : false
    }
}

export default Component