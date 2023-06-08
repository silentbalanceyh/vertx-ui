import Ux from 'ux';
import __Zn from './zero.workflow.dependency';
/*
 * Ko 专用
 * 1. draft（我的草稿）
 * 2. waiting（我的审批）
 * 3. pending（等待审批）
 * 4. own (我是责任人）
 * 5. supervise（我是监督者）
 */
const koFn = (fn = {}, reference) => (record, config, self) => {
    /*
     * record（当前数据记录，行记录、表单记录）
     * config（当前配置，列配置，表单字段 optionJsx）
     */
    const {
        draft = () => true,
        waiting = () => true,
        pending = () => true,
        own = () => true,
        supervise = () => true,
        history = () => true,
    } = fn;
    const user = Ux.isLogged();
    if (user) {
        if (record['flowEnd']) {
            // 查看历史
            return history(record, config, self)
        } else {
            // 未结束
            if (user.key === record['openBy']) {
                if ("DRAFT" === record.status) {
                    // 暂存草稿
                    return draft(record, config, self);
                } else {
                    // 已提交状态
                    return waiting(record, config, self);
                }
            } else {
                if (user.key === record['acceptedBy']) {
                    // 我审批
                    return pending(record, config, self);
                } else if (user.key === record.owner) {
                    // 我是责任人
                    return own(record, config, self);
                } else if (user.key === record['supervisor']) {
                    // 我是监督人
                    return supervise(record, config, self);
                } else {
                    // 谁都不是，和查看历史一样，不可以做其他操作
                    return history(record, config, self);
                }
            }
        }
    } else return false;
}

const koEdit = (reference) => {
    const {$permit} = reference.state;

    const permitFn = (permitSystem = [], $permit) => (record, config = {}) => {
        if ($permit) {
            return $permit.includes(config.id);
        } else {
            return permitSystem.includes(config.id);
        }
    }
    return koFn({
        // 我的草稿：保存 / 提交
        draft: permitFn(__Zn.Flow.DRAFT, $permit),
        // 我的提交
        // - 查看详情
        // - 撤销
        waiting: permitFn(__Zn.Flow.WAITING, $permit),
        // 我的审批
        pending: permitFn(__Zn.Flow.PENDING, $permit),
        // 历史信息
        history: permitFn(__Zn.Flow.HISTORY, $permit)
    }, reference);
}

const koAdd = (reference) => (record, config) => {
    const {$permit = []} = reference.state;
    return $permit.includes(config.id);
}
export default (reference) => ({
    // 「List专用」行选择插件
    koSelection: (record) => {
        const user = Ux.isLogged();
        return user.key === record.owner;
    },
    // 「List专用」行操作插件
    koRow: koEdit(reference),
    // 「Form专用」编辑表单插件
    koEdit: koEdit(reference),
    koAdd: koAdd(reference),
})