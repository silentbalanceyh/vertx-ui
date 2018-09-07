import React from 'react'
import Ux from "ux";
import {Fn, Mock, Tps} from 'app';
import {ComplexList, HelpCard} from 'web';
import Filter from './UI.Demo.Filter';
import FormAdd from './UI.Demo.Form.Add';
import FormEdit from './UI.Demo.Form'
import Op from './Op';

const {zero} = Ux;

@zero(Ux.rxEtat(require('./Cab.json'))
    .connect(state => Ux.dataIn(state)
        .rework({
            list: ["items"]
        })
        .rinit(["items"])
        .to()
    )
    .cab("UI.Demo")
    .search(Tps.fnDeptList)
    .to()
)
class Component extends React.PureComponent {

    render() {
        return (
            <HelpCard reference={this}>
                <ComplexList {...this.props}
                             reference={this}
                             rxEditPost={Op.opEditPost(this)}
                             $mockData={Mock.fnDeptList}
                             $formFilter={Filter}
                             $formAdd={FormAdd}
                             $formEdit={FormEdit}/>
            </HelpCard>
        )
    }
}

export default Component