import React from 'react'
import Ux from "ux";
import {Tps} from "app";
import {PageCard, TreeList} from 'web';
import Op from './Op';

const {zero} = Ux;

@zero(Ux.rxEtat(require('./Cab.json'))
    .connect(state => Ux.dataIn(state)
        .rework({
            "grid": ["tree"]
        })
        .to()
    )
    .search(Tps.fnCategoryList)
    .tree(Tps.fnCategory)
    .cab("UI.Demo")
    .to()
)
class Component extends React.PureComponent {
    render() {
        return (
            <PageCard reference={this}>
                <TreeList {...this.props}
                          rxItemDelete={Op.opItemDelete(this)}
                          rxItemAdd={Op.opItemAdd(this)}
                          rxItemEdit={Op.opItemEdit(this)}
                          reference={this}/>
            </PageCard>
        )
    }
}

export default Component