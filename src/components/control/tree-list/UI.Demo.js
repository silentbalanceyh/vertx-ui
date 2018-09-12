import React from 'react'
import Ux from "ux";
import {Tps} from "app";
import {PageCard, TreeList} from 'web';

const {zero} = Ux;

@zero(Ux.rxEtat(require('./Cab.json'))
    .search(Tps.fnCategoryList)
    .tree(Tps.fnCategory)
    .cab("UI.Demo")
    .search(Tps.fnDeptList)
    .to()
)
class Component extends React.PureComponent {
    render() {
        return (
            <PageCard reference={this}>
                <TreeList {...this.props}
                          reference={this}/>
            </PageCard>
        )
    }
}

export default Component