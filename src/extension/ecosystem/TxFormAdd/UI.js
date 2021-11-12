import React from 'react';
import Ex from "ex";
import Ux from 'ux';
import ExForm from '../ExForm/UI';

const componentInit = (reference) => {
    const {$workflow = {}} = reference.props;
    const state = {};
    Ux.ajaxPost("/api/up/duty-form/true", $workflow).then(response => {
        const $options = {};
        $options.form = response.form;
        state.$ready = true;
        state.$options = $options;
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
            const {$options = {}, $workflow = {}} = this.state;
            const $inited = {};
            $inited.processName = $workflow.name;
            const form = Ex.yoForm(this, {$options}, $inited);
            return (
                <ExForm {...form} $height={"300px"}/>
            )
        }, Ex.parserOfColor("TxForm").form());
    }
}

export default Component