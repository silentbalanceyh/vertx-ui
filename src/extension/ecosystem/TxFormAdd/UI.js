import React from 'react';
import Ex from "ex";
import Ux from 'ux';
import ExForm from '../ExForm/UI';
import ExBpmn from '../ExBpmn/UI';
import ExFormTitle from '../ExFormTitle/UI';
import './Cab.less';

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
            const form = Ex.yoForm(this, null, $inited);
            // 读取
            const title = Ux.fromHoc(this, "title");
            return (
                <div className={"ex-form-flow"}>
                    <ExFormTitle value={$workflow.name}/>
                    <ExForm {...form} $height={"300px"}
                            $op={Ex.wf(this).Act}/>
                    <ExFormTitle value={title['workflow']}/>
                    <ExBpmn config={$workflow['bpmn']} task={$workflow.task}/>
                </div>
            )
        }, Ex.parserOfColor("TxForm").form());
    }
}

export default Component