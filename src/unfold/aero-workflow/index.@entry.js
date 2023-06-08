import rxJsx from './workflow.i.@fn.web.component';
import rxJsxList from './workflow.i.@fn.jsx.list';
import rxJsxComplex from './workflow.i.@fn.jsx.complex';
import rxJsxForm from "./workflow.i.@fn.jsx.form";

import rxEvent from './workflow.i.@fn.rx.function';
import rxY_ from './workflow.i.@fn.y_.combine';
import rxAct from './workflow.i.@fn.op.act.button';
import rxKo from './workflow.i.@fn.ko.plugin';

export default (reference, node) => {
    /*
     * 基础流程规范，属性中必须包含 $workflow
     * {
     *      "parameter":
     * }
     */
    return ({
        // ======================= 函数区域 =======================
        // rxClose
        // rxRow
        ...rxEvent(reference),
        // ======================= webJsx =======================
        Jsx: {
            // webHelp
            // webFilter
            ...rxJsx(reference),
        },
        // ======================= 列表定制 =======================
        JsxList: {
            // serial
            // phase
            ...rxJsxList(reference),
        },
        // ======================= 行为 =======================
        Act: {
            // $opDraft,         暂存
            // $opStart，        提交：第一个节点
            // $opOpen，         提交：普通提交
            // $opSave,          保存
            // $opTransfer,      转单
            // $opCancel,        撤销
            // $opClose,         关闭
            // $opBack,          返回
            ...rxAct(reference, node),
        },
        // ======================= 复杂字段配置 =================
        JsxComplex: {
            // monitorContainer
            //    koTab
            ...rxJsxComplex(reference),
        },
        // ======================= 配置表单 =================
        JsxForm: {
            // phase
            // monitorHistory
            // monitorBpmn
            // monitorTrace
            // linkageTicket
            // linkageAsset
            // linkageEmployee
            ...rxJsxForm(reference),
        },
        // yo / yi / yu ( Channel ) 通道
        // yoAcl
        // yoQueue
        // yiQueue
        // yiForm
        // yoFormOpen
        // yoFormObserve
        ...rxY_(reference),
        // yoPlugins
        ...rxKo(reference),
    })
}