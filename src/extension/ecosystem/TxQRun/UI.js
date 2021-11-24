import React from 'react';
import Ux from "ux";
import Ex from "ex";
import ExListComplex from '../ExListComplex/UI';
import FormAdd from '../TxFormAdd/UI';
import FormEdit from '../TxFormEdit/UI';

import Op from './Op';
import {Button, Modal} from 'antd';
import ExForm from '../ExForm/UI';
import ExBpmn from '../ExBpmn/UI';

const renderHelp = (reference) => {
    const {$visibleHelp, $workflow = {}} = reference.state;
    if ($visibleHelp) {
        const configW = Ux.fromHoc(reference, "workflow");
        const $dialog = Ux.configDialog(reference, configW.window);
        const fnClose = (event) => {
            Ux.prevent(event);
            reference.setState({$visibleHelp: false});
        }
        $dialog.onCancel = fnClose
        const form = configW.form;
        const formConfig = {form};
        const {config = {}} = reference.props;
        return (
            <Modal {...$dialog} visible={$visibleHelp} footer={
                <Button icon={"exclamation-circle"} onClick={fnClose}>
                    {$dialog.cancelText}
                </Button>
            }>
                <ExForm config={formConfig} $inited={$workflow}/>
                <ExBpmn data={$workflow['bpmn']}
                        $offset={configW.offset}
                        $canvas={config.canvas}/>
            </Modal>
        )
    } else {
        return false;
    }
}

@Ux.zero(Ux.rxEtat(require("./Cab"))
    .cab("TxQRun")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        Ex.yiCompany(this)
            .then(Ex.wf(this).processDefinition)
            .then(Ux.pipe(this));
    }

    render() {
        return Ex.yoRender(this, () => {
            const hocConfig = Ux.fromHoc(this, "grid");
            let $config = Ux.clone(hocConfig);
            const form = {
                FormAdd,    // Start
                FormEdit,
            };
            // Workflow Processing
            const {config = {}} = this.props;
            if (config.options) {
                Object.assign($config.options, config.options);
            }
            return (
                <div>
                    {renderHelp(this)}
                    <ExListComplex {...Op.yoConfiguration(this, config)}
                                   $op={Op.yoOp(this)}
                                   $plugins={Op.yoPlugins(this)}
                                   $executor={Op.yoExecutor(this)}
                                   config={$config} $form={form}/>
                </div>
            )
        }, Ex.parserOfColor("TxQueue").control());
    }
}

export default Component