import Ux from 'ux';
import Ex from 'ex';

const rxOpen = (id, record, metadata) => {
    const {reference} = metadata;
    /* Loading 效果 */
    Ex.rsLoading(reference)();
    /* 读取数据 */
    Ex.rx(reference).view(id, record).then(data => {
        /* 打开新页 */
        Ex.rx(reference).open(id, data, record);
        /* 关闭 Loading 用*/
        Ex.rsLoading(reference, false)({});
    });
}

export default {
    yoConfiguration: (reference, workflow = {}) => {
        const inherits = Ex.yoAmbient(reference);
        const {parameter = {}, record = {}} = workflow;
        // code only
        inherits.$workflow = Ux.clone(parameter);
        const {$workflow = {}} = reference.state;
        // definitionId ( Critical )
        inherits.$workflow.definitionId = $workflow.definitionId;
        inherits.$workflow.record = record;
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
    yoExecutor: (reference) => ({
        // 快速审批
        fnApprove: (id, record, metadata = {}) => {

        },
        // 快速拒绝
        fnReject: (id, record, metadata = {}) => {

        },
        // 编辑草稿
        fnDraft: (id, record, metadata = {}) => rxOpen(id, record, metadata),
        // 查看
        fnView: (id, record, metadata = {}) => rxOpen(id, record, metadata),
        // 撤销
        fnCancel: (id, record, metadata = {}) => {

        },
        fnBatchApprove: () => {

        },
        fnBatchReject: () => {

        }
    }),
    rxPluginExecutor: (reference) => (record, config) => {
        const user = Ux.isLogged();
        if (user.key === record.owner) {
            // 我申请
            if ("DRAFT" === record.status) {
                // 草稿状态
                return ["fnDraft"].includes(config.executor);
            } else if ("PENDING" === record.status) {
                // 已提交状态
                return ["fnCancel", "fnView"].includes(config.executor);
            }
        } else {
            // 我审批
            return ["fnApprove", "fnReject", "fnView"].includes(config.executor);
        }
    },
    rxPluginChecked: (reference) => (record) => {
        const user = Ux.isLogged();
        return (user.key === record.owner);
    }
}