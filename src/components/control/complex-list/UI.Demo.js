import React from 'react'
import Ux from "ux";
import {ExComplexList, HelpCard} from 'web';
/* 读取数据专用 */
import Ajax from './Ajax';
/* 表单专用处理 */
import Filter from './UI.Demo.Filter';
import FormAdd from './UI.Demo.Form.Add';
import FormEdit from './UI.Demo.Form.Edit';
import {Mock} from "app";

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
                               {...Ajax}
                               reference={this}
                               FormFilter={Filter}
                               FormAdd={FormAdd}
                               FormEdit={FormEdit}
                    /* mock专用数据 */
                               $MOCK_LIST={Mock.fnDeptList}
                               $MOCK_COLUMN={{
                                   CURRENT: Mock.fnDeptColumnCurrent,
                                   FULL: Mock.fnDeptColumnFull
                               }}/>
            </HelpCard>
        )
    }
}

export default Component