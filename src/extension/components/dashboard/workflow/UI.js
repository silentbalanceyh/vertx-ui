import React from 'react';
import Ux from "ux";
import Ex from "ex";
import Sk from "skin";
import __ from "./Cab.module.scss";
import {ProCard} from "@ant-design/pro-components";
import UiSec from './UI.Sec';
import UiEmp from './UI.Emp';

const componentInit = (reference) => {
    Ex.yiAssist(reference).then(state => {
        const {$app} = reference.props;
        const sigma = $app._("sigma");
        const user = Ux.isLogged();
        Ux.ajaxPost("/api/up/flow-queue", {
            criteria: {
                "": true,
                sigma,
                acceptedBy: user.key,
                "type,i": [
                    "workflow.approval",
                    "workflow.oa"
                ]
            },
            pager: {
                page: 1,
                size: 5
            },
            sorter: [
                "createdAt,DESC"
            ]
        }).then(response => {
            state.$data = Ux.valueArray(response);
            reference.setState(state); // 更新组件状态
            return state;
        }).then(state => {
            return state;
        })
    }).then(Ux.ready).then(Ux.pipe(reference));
}

@Ux.zero(Ux.rxEtat(require("./Cab.json"))
    .cab("UI")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        componentInit(this)
    }

    render() {
        return Ex.yoRender(this, () => {
            const {$data = []} = this.state;
            const attrPage = Sk.mix(__.upg_dashboard_workflow);
            const inherit = Ex.yoAmbient(this);
            return (
                <div {...attrPage} className={"ux_table"}>
                    <ProCard ghost className={"region"}>
                        <UiSec {...inherit} data={$data}/>
                    </ProCard>
                    <ProCard ghost className={"region"}>
                        <UiEmp {...inherit} data={$data}/>
                    </ProCard>
                </div>
            )
        }, Ex.parserOfColor("PxWorkflow").page())
    }
}

export default Component