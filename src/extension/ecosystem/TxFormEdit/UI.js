import React from 'react';
import Ex from "ex";
import Ux from 'ux';
import ExForm from '../ExForm/UI';
import ExBpmn from '../ExBpmn/UI';
import ExFormTitle from '../ExFormTitle/UI';
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
            const title = Ux.fromHoc(this, "title");
            return (
                <div className={"ex-form-flow"}>
                    <ExFormTitle value={$workflow.name}/>
                    <ExForm {...form} $height={"300px"}
                            $op={Ex.wf(this).Act}/>
                    <ExFormTitle value={title['workflow']}/>
                    <ExBpmn config={$workflow['bpmn']}
                            task={$workflow.task} history={$workflow.history}/>
                </div>
            )
        }, Ex.parserOfColor("TxForm").form());
    }
}

export default Component