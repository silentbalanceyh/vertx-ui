import React from 'react'
import Ux from "ux";
import {Fn, Mock, Tps} from 'app';
import {ComplexList, HelpCard} from 'web';
import Filter from './UI.Demo.Filter';
import FormAdd from './UI.Demo.Form.Add';
import FormEdit from './UI.Demo.Form.Update'
import Op from './Op';

const {zero} = Ux;

@zero(Ux.rxEtat(require('./Cab.json'))
    .cab("UI.Demo")
    .connect({
        rxSearch: Tps.fnDeptList
    }, true)
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        Fn.demoMarkdown(this, require("./UI.Desc.md"))
    }

    render() {
        const {source = ""} = this.state ? this.state : {};
        return Fn.demoComponent(this,
            <HelpCard reference={this}>
                <ComplexList {...this.props}
                             reference={this}
                             rxEditPost={Op.$opEditPost(this)}
                             $mockData={Mock.fnDeptList}
                             $formFilter={Filter}
                             $formAdd={FormAdd}
                             $formEdit={FormEdit}/>
            </HelpCard>
            , source)
    }
}

export default Component