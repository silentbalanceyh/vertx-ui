import Ux from "ux";
import requestAsync from './workflow.__.@fn.request.norm';
/*
       {
            "openBy": "f7fbfaf9-8319-4eb0-9ee7-1948b8b56a67",
            "toUser": "a0b1c6bc-4162-47e2-8f16-c9f4dd162739",
            "record": {
                "size": 1114042,
                "name": "error.jpeg",
                "sizeUi": "1.06MB",
                "type": "image/jpeg",
                "file": [
                    {
                        "uid": "rc-upload-1643355423248-2",
                        "name": "error.jpeg",
                        "key": "ceafc8ec-0137-46df-a60f-38ae475b0242",
                        "type": "image/jpeg",
                        "size": 1114042,
                        "sizeUi": "1.06MB",
                        "extension": "jpeg"
                    }
                ],
                "category": "FILE.REQUEST",
                "extension": "jpeg",
                "key": "ceafc8ec-0137-46df-a60f-38ae475b0242"
            },
            "toUserName": "开发者",
            "status": "DRAFT",
            "owner": "f7fbfaf9-8319-4eb0-9ee7-1948b8b56a67",
            "title": "TEST",
            "catalog": "w.document.request",
            "type": "workflow.doc",
            "description": "<p>TEST</p>",
            "openAt": "2022-01-28T07:37:06.141Z",
            "ownerName": "虞浪",
            "language": "cn",
            "active": true,
            "sigma": "Qxw5HDkluJFnAPmcQCtu9uhGdXEiGNtP",
            "workflow": {
                "definitionKey": "process.file.management",
                "definitionId": "process.file.management:1:c80c1ad1-7fd9-11ec-b990-f60fb9ea15d8"
            },
            "draft": true
        }
    --- 关于标准化按钮说明：
    按钮方法    |    文字

     * 所有操作的统一数据格式来源：
     * 1. 工作流配置：
     * -- ref.props.$workflow（直接从表单提取）
     * 2. 当前节点的配置，位于后端表单配置中
     * -- ref.props.config.form.action
     * 其中 action 的格式：
     * {
     *     "data": {},
     *     "validation": {}
     * }
     * - data 为当前节点需追加到请求中的系统数据
     * - validation 为启用验证的验证规则
*/
const callbackForHistory = (reference) => (response) => {
    const {rxInit} = reference.props;
    if (Ux.isFunction(rxInit)) {
        rxInit(response);
    }
    return Ux.promise(response);
}
export default (reference, node) => ({

    // 暂存
    $opDraft: (ref) => (params) => requestAsync(ref, {
        op: "$opDraft",
        callback: (request) => {
            // acceptedBy   当前处理人 -> 开单人
            if (!request.acceptedBy) {
                request.acceptedBy = request.openBy;
            }
            // acceptedGroup 当前处理组 -> groupNext
            if (!request.acceptedGroup) {
                request.acceptedGroup = request['groupNext'];
            }
        }
    }, params).then(request => Ux.ajaxPost("/api/up/flow/start", request)),


    // 提交：第一个节点
    $opStart: (ref) => (params) => requestAsync(ref, {
        op: "$opOpen",
        callback: (request) => {
            // acceptedBy   当前处理人 -> 下一处理人
            if (!request.acceptedBy) {
                request.acceptedBy = request['toUser'];
            }
            // acceptedGroup 当前处理组 -> groupNext
            if (!request.acceptedGroup) {
                request.acceptedGroup = request['groupNext'];
            }
        }
    }, params).then(request => Ux.ajaxPost("/api/up/flow/start", request)),


    // 提交：普通提交
    $opOpen: (ref) => (params) => requestAsync(ref, {
        op: "$opOpen",
        callback: (request) => {
            // acceptedBy   当前处理人 -> 下一处理人
            if (!request.acceptedBy) {
                request.acceptedBy = request['toUser'];
            }
            // acceptedGroup 当前处理组 -> groupNext
            if (!request.acceptedGroup) {
                request.acceptedGroup = request['groupNext'];
            }
        }
    }, params).then(request => Ux.ajaxPut("/api/up/flow/complete", request)),


    // 保存
    $opSaving: (ref) => (params) => requestAsync(ref, {
        op: "$opSaving",
        callback: (request) => {
            // acceptedBy   当前处理人 -> 当前登录人
            if (!request.acceptedBy) {
                const user = Ux.isLogged();
                request.acceptedBy = user.key;
            }
            // acceptedGroup 当前处理组 -> groupNext
            if (!request.acceptedGroup) {
                request.acceptedGroup = request['groupNext'];
            }
        }
    }, params).then(request => Ux.ajaxPut("/api/up/flow/saving", request))
        .then(callbackForHistory(reference)),


    // 转单
    $opTransfer: (ref) => (params) => requestAsync(ref, {
        op: "$opTransfer",
        callback: (request) => {
            // acceptedBy   当前处理人 -> 转单人
            request.acceptedBy = request['toUser'];
            request.acceptedAt = new Date();
            delete request['toUser'];
            // acceptedGroup 当前处理组 -> groupNext
            if (!request.acceptedGroup) {
                request.acceptedGroup = request['groupNext'];
            }
        }
    }, params).then(request => Ux.ajaxPut("/api/up/flow/saving", request))
        .then(callbackForHistory(reference)),


    // 撤销
    $opCancel: (ref) => (params) => requestAsync(ref, {
        op: "$opCancel"
    }, params).then(request => Ux.ajaxPut("/api/up/flow/cancel", request)),


    // 关闭
    $opClose: (ref) => (params) => requestAsync(ref, {
        op: "$opClose"
    }, params).then(request => Ux.ajaxPut("/api/up/flow/close", request)),


    // 返回
    $opBack: (ref) => () => Ux.toOriginal(ref, null, ["tid"])
})