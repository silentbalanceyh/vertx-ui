import React from 'react'
import './Cab.less'
import Ux from 'ux';
import {PageCard} from 'web';
import Tool from './UI.Tool';

import PageArch from './UI.Page.Arch';
import PageGuide from './UI.Page.Guide';

const {zero} = Ux;

@zero(Ux.rxEtat(require('./Cab.json'))
    .cab("UI")
    .to()
)
class Component extends React.PureComponent {
    render() {
        return (
            <div className={"zero-main"}>
                <PageCard reference={this}>
                    <Tool/>
                    {Ux.auiTab(this)
                        .mount("tabPosition", "left")
                        .mount("size", "small")
                        .to(
                            <PageGuide {...Ux.toUniform(this.props)}/>,
                            <PageArch {...Ux.toUniform(this.props)}/>
                        )}
                </PageCard>
            </div>
        )
    }
}

export default Component