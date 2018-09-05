import React from 'react'
import Ux from "ux";
import {Fn, Mock, Tps} from 'app';
import {ComplexList, HelpCard} from 'web';
import Filter from './UI.Demo.Filter';
import FormAdd from './UI.Demo.Form.Add';
import FormEdit from './UI.Demo.Form.Update'

const {zero} = Ux;

@zero(Ux.rxEtat(require('./Cab.json'))
    .cab("UI.Demo")
    .connect({
        rxSearch: Tps.fnDeptList
    }, true)
    .to()
)
class Component extends React.PureComponent {

    render() {
        return (
            <HelpCard reference={this}>
                <ComplexList {...this.props}
                             reference={this}
                             $mockData={Mock.fnDeptList}
                             $formFilter={Filter}
                             $formAdd={FormAdd}
                             $formEdit={FormEdit}/>
            </HelpCard>
        )
    }
}

export default Component