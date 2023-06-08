import phaseFn from './cell.form.__.@fn.phase';
import monitorHistoryFn from './cell.form.__.@fn.monitor.history';
import monitorBpmnFn from './cell.form.__.@fn.monitor.bpmn';

import monitorApprFn from './cell.form.__.@fn.monitor.appr';
import monitorFileFn from './cell.form.__.@fn.monitor.file';

import linkageTicketFn from './cell.form.__.@fn.linkage.ticket';
import linkageAssetFn from './cell.form.__.@fn.linkage.asset';
import linkageEmployeeFn from './cell.form.__.@fn.linkage.employee';
import linkageAttachmentFn from './cell.form.__.@fn.linkage.attachment';
// eslint-disable-next-line import/no-anonymous-default-export
export default (reference) => ({
    __children: {
        phase: phaseFn(reference),


        // 操作历史专用字段
        monitorHistory: monitorHistoryFn(reference),
        // 流程图专用字段
        monitorBpmn: monitorBpmnFn(reference),

        
        // 意见流 / 文件流
        monitorAppr: monitorApprFn(reference),
        monitorFile: monitorFileFn(reference),


        // 关联工单
        linkageTicket: linkageTicketFn(reference),
        // 关联资产
        linkageAsset: linkageAssetFn(reference),
        // 关联员工
        linkageEmployee: linkageEmployeeFn(reference),
        // 关联附件
        linkageAttachment: linkageAttachmentFn(reference),
    }
})