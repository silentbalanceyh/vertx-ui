import React from 'react'
import Ux from "ux";
import {Mock, Tps} from "app";
import {PageCard, TreeList} from 'web';
import Op from './Op';
import Filter from "./UI.Demo.Filter";
import FormAdd from "./UI.Demo.Form.Add";
import FormEdit from "./UI.Demo.Form.Edit";

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
                          $mockData={Mock.fnCategoryList}
                          rxAddRow={Op.opAddRow(this)}
                          rxItemDelete={Op.opItemDelete(this)}
                          rxItemAdd={Op.opItemAdd(this)}
                          rxItemEdit={Op.opItemEdit(this)}
                          reference={this}
                          $formFilter={Filter}
                          $formAdd={FormAdd}
                          $formEdit={FormEdit}/>
            </PageCard>
        )
    }
}

export default Component