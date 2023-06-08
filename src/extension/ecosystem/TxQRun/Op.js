import Ux from 'ux';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    yoExecutor: (reference) => ({
        // 撤销
        // fnApprove: (id, record) => Ex.wf(reference).rxRow(record, {
        //     nodeOp: "$opApprove",
        //     dialog: "approve",
        //     action: (request) => Ux.ajaxPut("/api/up/flow/complete", request)
        // }),
        // 拒绝
        // fnReject: (id, record) => Ex.wf(reference).rxRow(record, {
        //     nodeOp: "$opReject",
        //     dialog: "reject",
        //     action: (request) => Ux.ajaxPut("/api/up/flow/complete", request)
        // }),
        // 编辑草稿
        // fnDraft: rxOpenFn(reference),
        fnView: (id, record = {}) => {
            const uri = record['todoUrl'];
            const {$router} = reference.props;
            const {
                $qbe,
                $query,
                $qr,
            } = reference.state;
            const __state = JSON.stringify({$qbe, $query, $qr})
            Ux.toRoute(reference, uri, {
                target: $router.path(),
                _tid: record.key,
                __state
            });
        },
        // 撤销
        // fnCancel: (id, record) => Ex.wf(reference).rxRow(record, {
        //     nodeOp: "$opCancel",
        //     dialog: "cancel",
        //     action: (request) => Ux.ajaxPut("/api/up/flow/cancel", request)
        // }),
        // 批量审批
        fnBatchApprove: () => {

        },
        // 批量拒绝
        fnBatchReject: () => {

        }
    })
}