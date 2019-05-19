import React from 'react'
import Ux from "ux";
import {Mock} from 'app';
import {ExComplexList, HelpCard} from 'web';
import Filter from './UI.Demo.Filter';
import FormAdd from './UI.Demo.Form.Add';
import FormEdit from './UI.Demo.Form.Edit'

const {zero} = Ux;

@zero(Ux.rxEtat(require('./Cab.json'))
    .cab("UI.Demo")
    .to()
)
class Component extends React.PureComponent {

    render() {
        return (
            <HelpCard reference={this}>
                {/* 新版的去掉数据从Redux取的 ComplexList */}
                <ExComplexList {...this.props}
                               reference={this}
                               $mockData={Mock.fnDeptList}
                               FormFilter={Filter}
                               FormAdd={FormAdd}
                               FormEdit={FormEdit}/>
            </HelpCard>
        )
    }
}

export default Component