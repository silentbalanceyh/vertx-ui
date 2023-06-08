import Ux from "ux";
// ======================= 数据部分 =======================
const dataRequest = (params = {}, config = {}) => {
    const parameters = Ux.valueRequest(params);
    const {
        workflow = {}
    } = config;
    const $workflow = Ux.valueOk(workflow, [
        "definitionKey",        // 工作流名称
        "definitionId",         // 工作流ID
        "instanceId",           // 工作流实例ID
        "taskId"                // 工作流任务ID
    ]);
    // workflow.task = 节点名：e.start, e.approve
    parameters.workflow = Ux.valueRequest($workflow);
    // request 转换规则
    return parameters;
}
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    // 新版本处理标准化参数
    // dataVerify,
    dataRequest,
}