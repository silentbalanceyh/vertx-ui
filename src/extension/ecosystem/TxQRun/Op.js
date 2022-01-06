import Ux from 'ux';
import Ex from 'ex';

const yoAction = ({record, config, reference}, {
    rxPending = () => true,
    rxDraft = () => true,
    rxApproval = () => true
}) => {
    const user = Ux.isLogged();
    if (user.key === record.owner) {
        // 我申请
        if ("DRAFT" === record.status) {
            // 草稿状态
            return rxDraft(record, config, reference);
        } else if ("PENDING" === record.status) {
            // 已提交状态
            return rxPending(record, config, reference);
        }
    } else {
        // 我审批
        return rxApproval(record, config, reference);
    }
}
const rxCallback = (reference, key) => Ux.sexDialog(reference, key,
    () => reference.setState({$forceUpdate: Ux.randomString(8)}))
export default {
    yoExecutor: (reference) => ({
        // 审批
        fnApprove: (id, record, metadata = {}) => Ex.wf(reference).row(record, metadata.reference, "$opApprove")
            .then(request => Ux.ajaxPut("/api/up/flow/complete", request))
            .then(() => rxCallback(reference, "approve")),
        // 拒绝
        fnReject: (id, record, metadata = {}) => Ex.wf(reference).row(record, metadata.reference, "$opReject")
            .then(request => Ux.ajaxPut("/api/up/flow/complete", request))
            .then(() => rxCallback(reference, "reject")),
        // 编辑草稿
        fnDraft: Ex.rxRowOpen(reference),
        // 查看
        fnView: Ex.rxRowOpen(reference),
        // 撤销
        fnCancel: (id, record, metadata = {}) => Ex.wf(reference).row(record, metadata.reference)
            .then(request => Ux.ajaxPut("/api/up/flow/cancel", request))
            .then(() => rxCallback(reference, "cancel")),
        fnBatchApprove: () => {

        },
        fnBatchReject: () => {

        }
    }),
    yoPlugins: (ref) => ({
        // 行选择函数
        koSelection: (record) => {
            const user = Ux.isLogged();
            return user.key === record.owner;
        },
        // 行操作
        koRow: (record, config, reference) => yoAction({
            record, config, reference
        }, {
            // 草稿
            rxDraft: (record, config) => [
                "fnDraft"
            ].includes(config.executor),
            // 已提交
            rxPending: (record, config) => [
                "fnView",
                "fnCancel"
            ].includes(config.executor),
            // 审批
            rxApproval: (record, config) => [
                "fnApprove",
                "fnReject",
                "fnView"
            ].includes(config.executor)
        }),
        // 编辑表单
        koEdit: (record, config, reference) => yoAction({
            record, config, reference
        }, {
            // 草稿
            rxDraft: (record, config) => [
                "op.submit.edit.draft",
                "op.submit.edit.start",
            ].includes(config.region),
            // 已提交
            rxPending: (record, config) => [
                "op.submit.edit.cancel"
            ].includes(config.region),
            // 审批
            rxApproval: (record, config) => [
                "op.submit.edit.approve",
                "op.submit.edit.reject"
            ].includes(config.region),
        }),
    }),
    yoConfiguration: (reference, workflow = {}) => {
        const inherits = Ex.yoAmbient(reference);
        const {parameter = {}, record = {}, decision = {}} = workflow;
        // code only
        inherits.$workflow = Ux.clone(parameter);
        const {$workflow = {}} = reference.state;
        // definitionId ( Critical )
        inherits.$workflow.definitionId = $workflow.definitionId;
        inherits.$workflow.record = record;
        inherits.$workflow.decision = decision;
        // refresh current
        const {$forceUpdate} = reference.state;
        if ($forceUpdate) {
            inherits.$forceUpdate = $forceUpdate;
        }
        return inherits;
    },
    yoOp: (reference) => ({
        rxWorkflow: () => () => {
            const {$workflow = {}} = reference.state;
            if (Ux.isNotEmpty($workflow)) {
                reference.setState({$visibleHelp: true});
            }
        },
        rxStatus: (ref) => ($queue) => {
            if ("NONE" === $queue) {
                ref.setState({$condition: {}});
            } else {
                const $condition = {};
                const user = Ux.isLogged();
                if ("REQUEST" === $queue) {
                    $condition['status,i'] = ["DRAFT", "PENDING"];
                    $condition['owner,='] = user.key;
                } else {
                    $condition['status,i'] = ["PENDING", "ACCEPTED"];
                    $condition['owner,<>'] = user.key;
                }
                ref.setState({$condition});
            }
        }
    }),
}