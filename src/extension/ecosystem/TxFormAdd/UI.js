import React from 'react';
import Ex from "ex";
import Ux from 'ux';
import ExForm from '../ExForm/UI';
import './Cab.less';
import TxMonitor from "../TxMonitor/UI";

const componentInit = (reference) => {
    const {$workflow = {}} = reference.props;
    const state = {};
    Ux.ajaxPost("/api/up/flow-form/true", $workflow).then(response => {
        state.$ready = true;
        state.$formW = response.form;
        state.$workflow = response['workflow'];
        reference.setState(state);
    })
}

@Ux.zero(Ux.rxEtat(require("./Cab"))
    .cab("TxFormAdd")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        componentInit(this);
    }

    render() {
        return Ex.yoRender(this, () => {
            const {$workflow = {}} = this.state;
            const $inited = {};
            $inited.status = "DRAFT";
            $inited.toGroupMode = "NONE";
            const form = Ex.yoForm(this, null, $inited);
            // 读取
            const data = Ex.wf(this).monitor($workflow);
            return (
                <div className={"ex-form-flow"}>
                    <ExForm {...form} $height={"300px"}
                            $op={Ex.wf(this, $workflow.task).Act}/>
                    <TxMonitor data={data}/>
                </div>
            )
        }, Ex.parserOfColor("TxForm").form());
    }
}

export default Component