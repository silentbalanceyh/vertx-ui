import Ux from "ux";

import __CFG from "./workflow.__.fn.config.norm";
import React from "react";
import {TxPhase} from '../aero-extenion';

export default (reference) => (ref, jsx) => {
    // 根据 $workflow 执行计算
    // 拷贝
    jsx = Ux.clone(jsx);
    if (!jsx.config) jsx.config = {};
    const $workflow = Ux.ambValue(reference, "$workflow");
    /*
     * optionJsx.config + phase 合并成最终的 config 属性
     * 该字段比较特殊，不包含其他属性信息
     * 1）工单信息在流程中属于共享属性，所以操作过程中不可以触发 onChange
     * 2）而在列表和表单渲染过程中，该状态会根据流程定义而有所改变
     */
    const config = __CFG.configUi($workflow, "phase");
    Object.assign(jsx.config, config);
    return (
        <TxPhase {...jsx} reference={ref}/>
    )
}