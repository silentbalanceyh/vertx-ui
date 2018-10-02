import React from 'react'
import Ux from 'ux'
import {PageCard} from 'web';
import ReactJson from 'react-json-view';

const {zero} = Ux;

@zero(Ux.rxEtat(require('./Cab'))
    .cab("UI")
    .to()
)
class Component extends React.PureComponent {
    render() {
        const {children, reference, $inited = {}} = this.props;
        let data = reference.state ? reference.state.demoData : {};
        if (!data) data = {};
        return (
            <div>
                {children}
                <PageCard reference={this}>
                    {Ux.aiGrid([12, 12],
                        <ReactJson src={data} name={null} enableClipboard={false}/>,
                        <ReactJson src={$inited} name={null} enableClipboard={false}/>
                    )}
                </PageCard>
            </div>
        )
    }
}

export default Component