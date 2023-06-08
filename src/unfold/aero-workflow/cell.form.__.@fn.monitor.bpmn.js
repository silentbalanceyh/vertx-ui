import __CFG from "./workflow.__.fn.config.norm";
import React from "react";
import {ExBpmn} from '../aero-extenion';

export default (reference) => () => {
    /*
     * 只能从状态中拿 $workflow 专用变量
     * 旧代码：Ux.ambValue(reference, "$workflow");
     * 此处不执行二选一的完结操作
     */
    const {$workflow = {}} = reference.state;
    const {$inited = {}} = reference.props;
    const $bpmn = {
        data: $workflow['bpmn'],
        task: $workflow.task,
        trace: $workflow.history,
        phase: $inited.phase
    };
    const canvas = __CFG.configUi($workflow, "canvas");
    return (
        <ExBpmn {...$bpmn} $canvas={canvas}/>
    )
}