import Ux from 'ux';
import Ex from 'ex';

const rxOpenFn = (reference) => (id, record = {}) => {
    const uri = record['todoUrl'];
    const {$router} = reference.props;
    Ux.toRoute(reference, uri, {
        target: $router.path(),
        _tid: record.key,
    });
}
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    yoExecutor: (reference) => ({

        // 撤销
        fnApprove: (id, record) => Ex.wf(reference).rxRow(record, {
            nodeOp: "$opApprove",
            dialog: "approve",
            action: (request) => Ux.ajaxPut("/api/up/flow/complete", request)
        }),
        // 拒绝
        fnReject: (id, record) => Ex.wf(reference).rxRow(record, {
            nodeOp: "$opReject",
            dialog: "reject",
            action: (request) => Ux.ajaxPut("/api/up/flow/complete", request)
        }),
        // 编辑草稿
        fnDraft: rxOpenFn(reference),
        fnView: rxOpenFn(reference),
        // 撤销
        fnCancel: (id, record) => Ex.wf(reference).rxRow(record, {
            nodeOp: "$opCancel",
            dialog: "cancel",
            action: (request) => Ux.ajaxPut("/api/up/flow/cancel", request)
        }),
        // 批量审批
        fnBatchApprove: () => {

        },
        // 批量拒绝
        fnBatchReject: () => {

        }
    }),
    yoOp: (reference) => ({
        /* 打开流程图专用方法 */
        rxWorkflow: () => Ex.wf(reference).rxHelp
    }),
}