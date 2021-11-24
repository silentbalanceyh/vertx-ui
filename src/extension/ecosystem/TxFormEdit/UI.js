import React from 'react';
import Ex from "ex";
import Ux from 'ux';
import ExForm from '../ExForm/UI';
import TxMonitor from '../TxMonitor/UI';
import './Cab.less';

const componentInit = (reference) => {
    const {$inited = {}} = reference.props;
    const state = {};
    Ux.ajaxPost("/api/up/flow-form/false", {
        instanceId: $inited['traceId']
    }).then(response => {
        state.$ready = true;
        state.$formW = response.form;
        state.$workflow = response['workflow'];
        reference.setState(state);
    })
}

@Ux.zero(Ux.rxEtat(require("./Cab"))
    .cab("TxFormEdit")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        componentInit(this);
    }

    render() {
        return Ex.yoRender(this, () => {
            const {$workflow = {}} = this.state;
            const $inited = Ex.wf(this).inited();
            const form = Ex.yoForm(this, null, $inited);
            // 读取
            form.$edition = Ex.wf(this).acl(form.config);
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