import React from 'react';
import Ux from 'ux';
import {ExComplexList} from 'ei';
import {PageCard} from 'web';

const {zero} = Ux;

@zero(Ux.rxEtat(require("./Cab"))
    .cab("UI")
    .to()
)
class Component extends React.PureComponent {
    render() {
        const config = Ux.fromHoc(this, "grid");
        return (
            <PageCard reference={this}>
                <ExComplexList config={config} {...this.props}/>
            </PageCard>
        )
    }
}

export default Component