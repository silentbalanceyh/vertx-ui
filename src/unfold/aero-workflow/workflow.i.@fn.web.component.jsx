import Ux from "ux";
import {Button, Modal} from "antd";
import opFn from "./workflow.__.fn.rx.op";
import React from "react";
import __Zn from './zero.workflow.dependency';

export default (reference) => ({
    webHelp: (Form, Bpmn) => {
        const {$help} = reference.state;
        if ($help) {
            const configW = Ux.fromHoc(reference, "workflow");
            const $dialog = Ux.configDialog(reference, configW.window);
            const fnClose = (event) => {
                Ux.prevent(event);

                Ux.of(reference).in({
                    $help: false
                }).done()
                // reference.?etState({$help: false});
            }
            $dialog.onCancel = fnClose
            const form = configW.form;
            const formConfig = {form};
            const {config = {}} = reference.props;
            const {$workflow = {}} = reference.props;
            return (
                <Modal {...$dialog} open={$help} footer={
                    <Button icon={Ux.v4Icon("exclamation-circle")} onClick={fnClose}>
                        {$dialog.cancelText}
                    </Button>
                }>
                    <Form config={formConfig} $inited={$workflow}/>
                    <Bpmn data={$workflow['bpmn']}
                          $offset={configW.offset}
                          $canvas={config.canvas}/>
                </Modal>
            );
        } else return false;
    },
    webFilter: (Component) => {
        if (Component) {
            const inherits = __Zn.yoAmbient(reference);
            return (
                <Component {...inherits} rxQuery={opFn.rxQueryFn(reference)}/>
            )
        } else return false;
    },
})