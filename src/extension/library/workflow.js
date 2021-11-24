import Ux from 'ux';
/*
 * request = W_TODO record
 * $workflow definition
 * {
 *      "definitionKey",
 *      "definitionId",
 *      "decision": {},
 *      "traceId": "instanceId",
 *      "traceTaskId": "taskId",
 *      "node": "xxx",
 *      "nodeOp": "xxx"
 * }
 * 最终输出结构
 * {
 *      "xxx": "xxx",
 *      "workflow": {
 *          "definitionKey",
 *          "definitionId",
 *          "instanceId",
 *          "taskId"
 *      },
 *      "confirmed": "",
 *      "status": "xxxx"
 * }
 */
const workflowData = (request = {}, $workflow) => {
    const {
        definitionKey,  // 定义键
        definitionId,   // 定义实例
        decision = {},
        node,
        nodeOp,
    } = $workflow;
    const workflow = {};
    workflow.definitionKey = definitionKey;
    workflow.definitionId = definitionId;
    if ($workflow['traceId']) {
        workflow.instanceId = $workflow['traceId'];
        workflow.taskId = $workflow['traceTaskId'];
    }
    if (decision.hasOwnProperty(nodeOp) && node) {
        const taskData = decision[nodeOp];
        if (taskData) {
            const decisionData = taskData[node];
            if (decisionData) {
                Object.assign(request, decisionData);
            }
        }
    }
    request.workflow = workflow;
}
export default (reference, node) => {
    /*
     * 基础流程规范，属性中必须包含 $workflow
     * {
     *      "parameter":
     * }
     */
    const {config = {}} = reference.props;
    return ({

        // 行为提交专用，流程驱动
        /*
           {
                "roleName": "开发人员",
                "record": {
                    "sizeUi": "1.86MB",
                    "instance": {
                        "uid": "rc-upload-1636725967401-2",
                        "name": "4k0005.jpg",
                        "key": "91157696-661d-412b-8d83-e750f36acab3",
                        "type": "image/jpeg",
                        "size": 1948572,
                        "sizeUi": "1.86MB",
                        "extension": "jpg"
                    },
                    "type": "image/jpeg",
                    "category": "FILE.REQUEST",
                    "size": 1948572,
                    "extension": "jpg",
                    "name": "4k0005.jpg"
                },
                "toUser": "63b5383e-5a2e-44ec-87d4-add096aac548",
                "toGroupMode": "ROLE",
                "name": "Test",
                "toRole": "1f27530f-38db-4662-81d4-46ea15b04205",
                "status": "DRAFT",
                "userName": "开发者",
                "draft": true
            }
         */
        Act: {
            /*
             * 添加界面
             * 1. 存草稿
             * 2. 启动界面
             */
            $opDraft: (ref) => (params) => {
                const request = Ux.valueRequest(params);
                /*
                 * 存草稿的两个核心字段
                 * - draft: true
                 * - status: DRAFT
                 * 1. 生成Todo
                 * 2. 更新/插入Record记录
                 * 3. 流程转移Move
                 */
                workflowData(request, {
                    ...ref.props.$workflow,
                    node, nodeOp: "$opDraft"
                });
                return Ux.ajaxPost("/api/up/flow/start", request);
            },
            $opMove: (ref) => (params) => {
                const request = Ux.valueRequest(params);
                /*
                 * 开流程的两个核心字段
                 * - draft: false
                 * - status: PENDING
                 * 1. 生成Todo
                 * 2. 更新/插入Record记录
                 * 3. 流程转移Move
                 */
                workflowData(request, {
                    ...ref.props.$workflow,
                    node, nodeOp: "$opMove"
                });
                return Ux.ajaxPost("/api/up/flow/start", request);
            },
            /*
             * 编辑界面
             * 1. 存草稿
             * 2. 提交申请
             * 审批界面
             * 1. 审批
             * 2. 拒绝
             */
            /*
             * 操作：存草稿
             *
             * 1. 更新Todo
             * 2. 更新/插入Record记录
             */
            $opSaving: (ref) => (params) => {
                const request = Ux.valueRequest(params);
                workflowData(request, ref.props.$workflow);
                return Ux.ajaxPut("/api/up/flow/saving", request);
            },
            $opStart: (ref) => (params) => {
                const request = Ux.valueRequest(params);
                workflowData(request, {
                    ...ref.props.$workflow,
                    traceId: params.traceId,
                    traceTaskId: params.traceTaskId,
                });
                return Ux.ajaxPut("/api/up/flow/complete", request);
            },
            $opApprove: (ref) => (params) => {
                const request = Ux.valueRequest(params);
                workflowData(request, {
                    ...ref.props.$workflow,
                    traceId: params.traceId,
                    traceTaskId: params.traceTaskId,
                    node, nodeOp: "$opApprove"
                });
                return Ux.ajaxPut("/api/up/flow/complete", request);
            },
            $opReject: (ref) => (params) => {
                const request = Ux.valueRequest(params);
                workflowData(request, {
                    ...ref.props.$workflow,
                    traceId: params.traceId,
                    traceTaskId: params.traceTaskId,
                    node, nodeOp: "$opReject"
                });
                return Ux.ajaxPut("/api/up/flow/complete", request);
            },
            $opCancel: (ref) => (params) => {
                const request = Ux.valueRequest(params);
                workflowData(request, {
                    ...ref.props.$workflow,
                    traceId: params.traceId,
                    traceTaskId: params.traceTaskId,
                });
                return Ux.ajaxPut("/api/up/flow/cancel", request);
            },
        },
        // 读取流程详细信息
        processDefinition: (state) => {
            // 是否 multiple，如果 multiple 则直接返回
            if (config.multiple) {
                return Ux.promise(state);
            }
            const {parameter = {}} = config;
            if (!parameter['definitionKey']) {
                console.error("对不起，您的参数中缺乏 `definitionKey` 参数！", parameter);
                return Ux.promise(state);
            }
            // 读取流程并加载
            return Ux.ajaxGet("/api/up/flow-definition/:code", {
                code: parameter['definitionKey']
            }).then(response => {
                // 单参数 state
                if (state) {
                    return Ux.promise(state, "$workflow", response);
                } else {
                    // 无参数
                    return Ux.promise(response);
                }
            })
        },
        // 处理工作流数据，行记录选择
        row: (record = {}, reference, nodeOp) => Ux.ajaxPost("/api/up/flow-form/false", {
            instanceId: record['traceId']
        }).then(response => {
            // 表单处理
            const request = Ux.clone(record);
            const {$workflow = {}} = reference.props;
            const {workflow = {}} = response;
            workflowData(request, {
                ...$workflow,
                traceId: record.traceId,
                traceTaskId: record.traceTaskId,
                node: workflow.task, nodeOp,
            });
            // Record Key injection
            request.record = {};
            request.record.key = request.modelKey;
            return Ux.promise(request);
        }),
        // 初始化
        inited: () => {
            const {$inited = {}, $workflow = {}} = reference.props;
            let initialized = Ux.clone($inited);
            if ($inited.record) {
                // 先执行 record 的 initial
                const {record} = $workflow;
                let normalized = Ux.clone($inited.record);
                if (record && record.initial) {
                    const executor = reference.props[record.initial];
                    if (Ux.isFunction(executor)) {
                        normalized = executor(normalized);
                    }
                }
                Ux.remove(initialized, "record");
                Object.keys(normalized).forEach(field => initialized[`record@${field}`] = normalized[field])
            }

            return initialized;
        },
        // acl 控制
        acl: (formConfig = {}) => {
            const {$inited = {}} = reference.props;
            const {acl = {}} = $inited;
            const edition = {};
            if (acl.edition) {
                Object.keys($inited).filter(key => !Ux.isObject($inited[key])).forEach(key => {
                    edition[key] = !!acl.edition[key];
                })
                const {form: {ui = []}} = formConfig;
                ui.forEach(item => item.forEach(cell => {
                    let field = Ux.toFieldName(cell);
                    if (!acl.edition[field]) {
                        edition[field] = false;
                    }
                }))
                return edition;
            } else {
                if (false === acl.edition) {
                    return false;
                } else if (!acl.hasOwnProperty('edition')) {
                    return {};
                }
            }
        },
        // bpmn
        monitor: ($workflow = {}) => {
            const {$inited = {}} = reference.props;
            const data = {}
            data.$bpmn = {
                data: $workflow['bpmn'],
                task: $workflow.task,
                trace: $workflow.history,
                phase: $inited.status
            }
            data.$history = $inited.history ? $inited.history : [];
            return data;
        },
        // refresh tab
        tab: () => (action) => {
            if (node === action ||
                (Ux.isArray(node) && node.includes(action))) {
                reference.setState({$forceUpdate: Ux.randomString(8)});
            }
        }
    })
}