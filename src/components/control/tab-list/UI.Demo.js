import React from 'react'
import Ux from "ux";
import {Mock, Tps} from 'app';
import {HelpCard, TabList} from 'web';
import Filter from './UI.Demo.Filter';
import FormAdd from './UI.Demo.Form.Add';
import FormEdit from './UI.Demo.Form.Edit'
import Op from './Op';

const {zero} = Ux;

@zero(Ux.rxEtat(require('./Cab.json'))
    .cab("UI.Demo")
    .search(Tps.fnDeptList)
    .to()
)
class Component extends React.PureComponent {

    render() {
        return (
            <HelpCard reference={this}>
                <TabList {...this.props}
                         reference={this}
                         $mockData={Mock.fnDeptList}
                         rxAddRow={Op.opAddRow(this)}
                         $formFilter={Filter}
                         $formAdd={FormAdd}
                         $formEdit={FormEdit}/>
            </HelpCard>
        )
    }
}

export default Component