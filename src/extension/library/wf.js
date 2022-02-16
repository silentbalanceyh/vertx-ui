import Ux from 'ux';
import Ch from './channel';
import React from 'react';
import {Button, Checkbox, Icon, Modal, Radio, Select, Tag, Tooltip} from "antd";
import {MagicView} from 'web';
// Extension 专用可重用组件
import ExBpmn from "../ecosystem/ExBpmn/UI";
import ExLinkage from '../ecosystem/ExLinkage/UI';
// Workflow 流程引擎专用组件
import TxHistory from "../ecosystem/TxHistory/UI";

// ======================= 配置部分 =======================
const configUi = ($workflow = {}, key, array = false) => {
    const {config = {}} = $workflow;
    const {ui = {}} = config;
    const configData = ui[key];
    if (configData) {
        return configData;
    } else {
        return array ? [] : {};
    }
}
const configPhase = ($workflow = {}, configRef = {}) => {
    const phase = configUi($workflow, "phase");
    const {forbidden = []} = phase;
    /*
     * items配置：[
     *      "",
     *      "",
     * ]
     * 字符串模式
     */
    let {items = []} = configRef;
    items = Ux.clone(items);
    items = items.filter(item => {
        let key;
        if ("string" === typeof item) {
            key = item.split(',')[0];
        } else {
            key = item.key;
        }
        return !forbidden.includes(key);
    });
    return items;
}


// ======================= 数据部分 =======================
const dataRequest = (params = {}, pWorkflow = {}, pConfig = {}) => {
    const request = Ux.valueRequest(params);
    request.workflow = Ux.valueOk(pWorkflow, [
        "definitionKey",
        "definitionId",
        "instanceId",
        "taskId"
    ]);
    const op = configUi(pWorkflow, "op");
    const {
        node,
        nodeOp,
    } = pConfig;
    Ux.dgDebug({node, op, nodeOp}, "节点数据：", "#ff8626")
    if (node && op[nodeOp]) {
        const taskData = op[nodeOp];
        const parameters = taskData[node];
        if (parameters) {
            Object.assign(request, parameters);
        }
    }
    return request;
}

/*
 * Ko 专用
 * 1. draft（我的草稿）
 * 2. waiting（我的审批）
 * 3. pending（等待审批）
 * 4. own (我是责任人）
 * 5. supervise（我是监督者）
 */
const koFn = (fn = {}) => (record, config, self) => {
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
            return history(record, config, self)
        } else {
            if (user.key === record['openBy']) {
                if ("DRAFT" === record.status) {
                    // 我的草稿
                    return draft(record, config, self);
                } else {
                    // 已提交状态
                    return waiting(record, config, self);
                }
            } else {
                if (user.key === record['toUser']) {
                    // 我审批
                    return pending(record, config, self);
                } else if (user.key === record.owner) {
                    // 我是责任人
                    return own(record, config, self);
                } else if (user.key === record['supervisor']) {
                    // 我是监督人
                    return supervise(record, config, self);
                } else return false;
            }
        }
    } else return false;
}

const koOp = (ref) => koFn({
    // 我的草稿
    // - 存草稿
    // - 提交申请
    draft: (record, config = {}) => [
        "$opSaving",
        "$opOpen",
        "$opReset"
    ].includes(config.id),
    // 我的提交
    // - 查看详情
    // - 撤销
    waiting: (record, config = {}) => [
        "$opView",
        "$opCancel",
        "$opBack"
    ].includes(config.id),
    // 我的审批
    pending: (record, config = {}) => [
        "$opView",
        "$opApprove",
        "$opReject"
    ].includes(config.id),
    // 历史信息
    history: (record, config = {}) => [
        "$opBack",
    ].includes(config.id),
})

// ======================= 函数部分 =======================
const rxQueryFn = (reference) => (criteria) => {
    Ux.dgDebug(criteria, "构造的查询条件", "#58c623");
    let {$queryDefault = {}} = reference.state;
    const $query = Ux.clone($queryDefault);
    $query.criteria = Ux.assign($query.criteria, criteria, 1);
    reference.setState({$query: Ux.clone($query)});
}
const rxHelpFn = (reference) => () => {
    const {$workflow = {}} = reference.props;
    if (Ux.isNotEmpty($workflow)) {
        reference.setState({$help: true});
    }
}
const rxCloseFn = (reference) => (data = {}) => {
    // DRAFT 草稿继续
    const name = Ux.toQuery("name");
    if ("DRAFT" === data.status) {
        const target = Ux.toQuery("target");
        Ux.toRoute(reference, `/workflow/run`, {
            name, _tid: data.key,
            target,
        });
    } else {
        Ux.toRoute(reference, `/workflow/queue`, {
            name
        });
    }
}
const jsxListFn = (reference) => ({
    // 函数模式
    serial: (inherit = {}) => {
        const {data = {}, config = {}} = inherit;
        const {prefix = ""} = config;
        const title = Ux.formatExpr(prefix, data, true);
        return (
            <span className={"ex-workflow-serial"}>
                        {data.serial}
                &nbsp;
                <Tooltip title={title} overlayClassName={"ex-workflow-tooltip"}>
                            <Icon type={"link"}/>
                        </Tooltip>
                    </span>
        )
    },
    phase: (inherit = {}) => {
        const {data = {}, config = {}} = inherit;
        const $workflow = Ux.ambValue(reference, "$workflow");
        let items = configPhase($workflow, config);
        items = Ux.Ant.toOptions(reference, {items});
        return (<MagicView config={{items}} value={data.phase}/>)
    }
})
// eslint-disable-next-line import/no-anonymous-default-export
export default (reference, node) => {
    /*
     * 基础流程规范，属性中必须包含 $workflow
     * {
     *      "parameter":
     * }
     */
    return ({
        rxClose: rxCloseFn(reference),
        rxHelp: rxHelpFn(reference),
        /*
         * 打开行相关操作（行打开时需重新读取工作流）
         */
        rxRow: (record = {}, config = {}) => Ux.ajaxPost("/api/up/flow-form/false", {
            instanceId: record['flowInstanceId']
        }).then(response => {
            // 这一步很重要，提取 node 参数专用
            const {nodeOp, action, dialog} = config;
            const {workflow = {}} = response;
            const $workflow = Ux.clone(reference.props.$workflow);
            Object.assign($workflow, workflow);

            if (record['flowInstanceId']) {
                $workflow.instanceId = record['flowInstanceId'];
            }
            if (record.taskId) {
                $workflow.taskId = record.taskId;
                $workflow.taskKey = record.taskKey;
            }

            const request = dataRequest(record, $workflow, {
                node: workflow.task,
                nodeOp
            });
            // Record Key injection
            request.record = {};
            request.record.key = request.modelKey;
            const executor = Ux.isFunction(action) ? action : () => {
                console.warn("`action`参数丢失", config);
                return Ux.promise(request);
            };
            return executor(request)
                .then(() => Ux.sexDialog(reference, dialog,
                    () => reference.setState({$forceUpdate: Ux.randomString(8)}))
                )
                .catch(error => Ux.ajaxError(reference, error));
        }),
        // ======================= 函数区域 =======================
        Jsx: {
            webHelp: (Form, Bpmn) => {
                const {$help} = reference.state;
                if ($help) {
                    const configW = Ux.fromHoc(reference, "workflow");
                    const $dialog = Ux.configDialog(reference, configW.window);
                    const fnClose = (event) => {
                        Ux.prevent(event);
                        reference.setState({$help: false});
                    }
                    $dialog.onCancel = fnClose
                    const form = configW.form;
                    const formConfig = {form};
                    const {config = {}} = reference.props;
                    const {$workflow = {}} = reference.props;
                    return (
                        <Modal {...$dialog} visible={$help} footer={
                            <Button icon={"exclamation-circle"} onClick={fnClose}>
                                {$dialog.cancelText}
                            </Button>
                        }>
                            <Form config={formConfig} $inited={$workflow}/>
                            <Bpmn data={$workflow['bpmn']}
                                  $offset={configW.offset}
                                  $canvas={config.canvas}/>
                        </Modal>
                    )
                } else return false;
            },
            webFilter: (Component) => {
                if (Component) {
                    const inherits = Ch.yoAmbient(reference);
                    return (
                        <Component {...inherits} rxQuery={rxQueryFn(reference)}/>
                    )
                } else return false;
            },
            qrOpen: (config = {}) => (
                <Button icon={"plus"} type={"primary"}
                        className={"open-button"}
                        onClick={event => {
                            Ux.prevent(event);
                            const {$router} = reference.props;
                            const target = $router.path();
                            const name = Ux.toQuery("name");
                            Ux.toRoute(reference, `/workflow/open`, {name, target});
                        }}>
                    {config.open}
                </Button>
            ),
            qrLabel: (config = {}) => {
                const {condition = {}} = config;
                return (
                    <span className={"title title-right"}>
                        {condition.label}：
                    </span>
                )
            },
            qrSelected: (config = {}, doQuery) => {
                const {condition = {}, queue = {}} = config;
                const {$condition = [], $keys = [], $view = []} = reference.state;
                if (0 < $keys.length || 0 < $view.length) {
                    const $display = Ux.clone($condition);
                    const {vector = {}, clear} = condition;
                    const {icon = {}} = queue;
                    $view.filter(view => !!vector[view]).forEach(view => {
                        const cond = {};
                        cond.key = view;
                        cond.name = vector[view];
                        if (icon[view]) {
                            cond.color = icon[view];
                        }
                        $display.push(cond);
                    });
                    return (
                        <div>
                            <Tooltip title={clear}>
                                {/* eslint-disable-next-line */}
                                <a href={""} onClick={event => {
                                    Ux.prevent(event);
                                    const state = {};
                                    state.$view = [];
                                    state.$keys = [];
                                    state.$condition = doQuery(reference, state);
                                    reference.setState(state);
                                }}>
                                    <Icon type={"delete"}/>
                                </a>
                            </Tooltip>&nbsp;&nbsp;
                            {$display.map(cond => (
                                <Tag key={cond.key} color={cond.color ? cond.color : "geekblue"}
                                     closable
                                     onClose={event => {
                                         Ux.prevent(event);
                                         let {$view = [], $keys = []} = reference.state;
                                         const state = {};
                                         state.$view = Ux.clone($view).filter(key => cond.key !== key);
                                         state.$keys = Ux.clone($keys).filter(key => cond.key !== key);
                                         state.$condition = doQuery(reference, state);
                                         reference.setState(state);
                                     }}>
                                    {cond.name}
                                </Tag>
                            ))}
                        </div>
                    )
                } else {
                    return (
                        <Tag>
                            {condition.empty}
                        </Tag>
                    )
                }
            },
            qrInView: (config = {}, doQuery) => {
                const {queue = {}} = config;
                const {items = [], title, icon = {}} = queue;
                const options = Ux.aiExprOption(items);
                const {$view = []} = reference.state;
                const attrs = {};
                attrs.style = {
                    minWidth: 260
                }
                attrs.mode = "multiple";
                attrs.maxTagCount = 1;
                return (
                    <div>
                        <span className={"title"}>{title}</span>
                        ：
                        <Select value={$view} onChange={event => {
                            const $view = Ux.ambEvent(event);
                            const state = Ux.clone(reference.state);
                            state.$view = $view;
                            state.$condition = doQuery(reference, state);
                            reference.setState(state);
                        }} {...attrs}>
                            {options.map(option => {
                                const {label, ...rest} = option;
                                return (
                                    <Select.Option {...rest}>
                                        {<Icon type={"user"} style={{
                                            color: icon[option.key]
                                        }}/>}
                                        &nbsp;&nbsp;
                                        {label}
                                    </Select.Option>
                                )
                            })}
                        </Select>
                    </div>
                )
            },
            qrInOpr: (config = {}, doQuery) => {
                const {connector = {}} = config;
                const {items = []} = connector;
                const options = Ux.aiExprOption(items);
                const {$connector = "OR"} = reference.state;
                return (
                    <div className={"title-right"}>
                        <Radio.Group value={$connector} onChange={event => {
                            const $connector = Ux.ambEvent(event);
                            const state = Ux.clone(reference.state);
                            state.$connector = $connector;
                            state.$condition = doQuery(reference, state);
                            reference.setState(state);
                        }}>
                            {options.map(option => {
                                const {label, ...rest} = option;
                                return (
                                    <Radio.Button {...rest}>
                                        {label}
                                    </Radio.Button>
                                )
                            })}
                        </Radio.Group>
                    </div>
                )
            },
            qrInCheck: (config = {}, doQuery) => {
                const {dim = {}} = config;
                const {items = [], title} = dim;
                const options = Ux.aiExprOption(items);
                const {$keys = []} = reference.state;
                return (
                    <div>
                        <span className={"title"}>{title}</span>
                        ：
                        <Checkbox.Group options={options} value={$keys} onChange={($keys = []) => {
                            const state = Ux.clone(reference.state);
                            state.$keys = $keys;
                            state.$condition = doQuery(reference, state);
                            reference.setState(state);
                        }}/>
                    </div>
                )
            }
        },
        // ======================= Jsx组件定制 =======================
        /*
         * 列表定制
         */
        JsxList: jsxListFn(reference),
        // ======================= 复杂字段配置 =======================
        JsxComplex: {
            monitorContainer: {
                /*
                 * 页签动态显示
                 */
                koTab: (item = {}) => {
                    const {$workflow = {}} = reference.props;
                    const {config = {}} = $workflow;
                    const linkage = config.linkage ? config.linkage : {};
                    // 默认 key 值
                    const enabled = [
                        "bpmn",         // 流程图
                        "history"       // 操作历史
                    ];
                    Object.keys(linkage).forEach(tab => enabled.push(tab));
                    return enabled.includes(item.key);
                }
            }
        },
        /*
         * 表单定制
         */
        JsxForm: {
            phase: (ref, jsx) => {
                // 根据 $workflow 执行计算
                if (!jsx.config) jsx.config = {};
                const $workflow = Ux.ambValue(reference, "$workflow");
                jsx.config.items = configPhase($workflow, jsx.config);
                return Ux.aiMagic(ref, jsx);
            },
            __children: {
                // 关联工单
                linkageTicket: (ref) => {
                    const $workflow = Ux.ambValue(reference, "$workflow");
                    const {$inited = {}, $mode} = ref.props;
                    const inherit = Ch.yoAmbient(reference);
                    inherit.$inited = $inited;

                    const {config = {}} = $workflow;
                    const {ticket = {}} = config.linkage ? config.linkage : {};
                    inherit.config = ticket;
                    inherit.$mode = $mode
                    inherit.$renders = jsxListFn(reference);
                    inherit.$plugins = {
                        koSelection: (record = {}) => [
                            "FINISHED",     // 已完成
                            "CANCELED"      // 已撤销
                        ].includes(record.phase)
                    }
                    return (
                        <ExLinkage {...inherit}/>
                    )
                },
                // 流程图专用字段
                monitorBpmn: () => {
                    /*
                     * 只能从状态中拿 $workflow 专用变量
                     * 旧代码：Ux.ambValue(reference, "$workflow");
                     * 此处不执行二选一的完结操作
                     */
                    const {$workflow = {}} = reference.state;
                    const {$inited = {}} = reference.props;
                    const $bpmn = {
                        data: $workflow['bpmn'],
                        task: $workflow.task,
                        trace: $workflow.history,
                        phase: $inited.phase
                    };
                    const canvas = configUi($workflow, "canvas");
                    return (
                        <ExBpmn {...$bpmn} $canvas={canvas}/>
                    )
                },
                // 操作历史专用字段
                monitorHistory: () => {
                    const {$inited = {}} = reference.props;
                    const data = $inited.history ? $inited.history : [];
                    data.forEach(history => {
                        // 开单人
                        history.openBy = $inited.openBy;
                    });
                    return (
                        <TxHistory data={data}/>
                    )
                }
            }
        },
        // 行为提交专用，流程驱动
        Act: {

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
             */
            /*
             * 添加界面
             * 1. 存草稿
             * 2. 启动界面
             */
            $opDraft: (ref) => (params) => {
                /*
                 * 存草稿的两个核心字段
                 * - draft: true
                 * - status: DRAFT
                 * 1. 生成Todo
                 * 2. 更新/插入Record记录
                 * 3. 流程转移Move
                 */
                const request = dataRequest(params, ref.props.$workflow, {
                    node,
                    nodeOp: "$opDraft"
                });
                // return Ux.promise({serial: "H"});
                return Ux.ajaxPost("/api/up/flow/start", request);
            },
            $opOpen: (ref) => (params) => {
                const request = dataRequest(params, ref.props.$workflow, {
                    node,
                    nodeOp: "$opOpen"
                })
                return Ux.ajaxPut("/api/up/flow/complete", request);
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
                const request = dataRequest(params, ref.props.$workflow);
                return Ux.ajaxPut("/api/up/flow/saving", request);
            },
            $opCancel: (ref) => (params) => {
                const request = dataRequest(params, ref.props.$workflow, {
                    node,
                    nodeOp: "$opCancel"
                });
                return Ux.ajaxPut("/api/up/flow/cancel", request);
            },
            $opBack: (ref) => () => Ux.toOriginal(ref, null, ["tid"]),
            $opApprove: (ref) => (params) => {
                const request = dataRequest(params, ref.props.$workflow, {
                    node,
                    nodeOp: "$opApprove"
                })
                return Ux.ajaxPut("/api/up/flow/complete", request);
            },
            $opReject: (ref) => (params) => {
                const request = dataRequest(params, ref.props.$workflow, {
                    node,
                    nodeOp: "$opReject"
                })
                return Ux.ajaxPut("/api/up/flow/complete", request);
            },
        },


        // ======================= TxPage 组件 =======================
        /*
         * 从 ?name=xxx 中读取 workflow 专用参数
         */
        yiPage: (state = {}) => {
            const workflow = Ux.toQuery("name");
            if (workflow) {
                // ?name 中有值
                return Ux.ajaxGet("/api/up/flow-definition/:code", {
                    code: workflow
                }).then(response => {
                    state.$workflow = response;
                    // 走 assist 流程
                    return Ux.asyncAssist(response['uiAssist'], reference, state);
                }).then(Ux.ready).catch(() => {
                    state.$error = true;
                    return Ux.promise(state);
                })
            } else {
                state.$error = true;
                return Ux.promise(state);
            }
        },
        /*
         * 提取核心配置，关联后端 W_FLOW 表结构
         */
        yoPage: ($workflow = {}, $inited = {}) => {
            const {
                startConfig = {},
                runConfig = {},
                generateConfig = {},
                uiConfig = {},
                uiLinkage = {},
            } = $workflow;
            const configuration = Ux.valueOk($workflow, [
                "task",
                "name",
                "definitionId",
                "definitionKey",
                "bpmn",
                "code",
                "type"
            ]);
            const config = {};
            config.start = startConfig[$workflow.task];
            config.run = runConfig[$workflow.task];
            config.generate = generateConfig[$workflow.generate];
            config.ui = uiConfig;
            config.linkage = uiLinkage;
            configuration.config = Ux.valueValid(config);
            /*
             * 数据部分
             */
            if ($inited['flowInstanceId']) {
                configuration.instanceId = $inited['flowInstanceId'];
            }
            if ($inited.taskId) {
                configuration.taskId = $inited.taskId;
                configuration.taskKey = $inited.taskKey;
            }
            /*
             * 继承配置专用
             * configuration -> $workflow
             */
            const inherits = Ch.yoAmbient(reference);
            inherits.$workflow = configuration;
            inherits.$inited = $inited;

            return inherits;
        },
        // ======================= 列表组件 =======================
        yiQueue: () => {
            const state = {};
            state.$ready = true;
            state.$viewSpec = "DEFAULT";        // 特殊视图

            /*
             * 外层传入 $query，保留分页、排序、列参数
             * $query 是查询专用的，在更新时更新查询条件
             * $queryDefault 是默认查询条件，所有查询操作都基于该查询条件处理
             */
            const grid = Ux.fromHoc(reference, "grid");
            state.$query = Ux.clone(grid.query);
            state.$queryDefault = Ux.clone(grid.query);
            state.$forceUpdate = Ux.randomString(8);
            reference.setState(state);
        },
        yoQueue: () => {
            const hocConfig = Ux.fromHoc(reference, "grid");
            let $config = Ux.clone(hocConfig);
            // Workflow Processing
            const {config = {}} = reference.props;
            if (config.options) {
                Object.assign($config.options, config.options);
            }
            return $config;
        },
        yoQueueList: (workflow = {}) => {
            const inherits = Ch.yoAmbient(reference);
            const {parameter = {}, record = {}} = workflow;
            // code only
            inherits.$workflow = Ux.clone(parameter);
            const {$workflow = {}} = reference.state;


            // definitionId ( Critical )
            inherits.$workflow.definitionId = $workflow.definitionId;
            inherits.$workflow.record = record;


            // refresh current
            const {$query = {}, $forceUpdate} = reference.state;
            inherits.$query = $query;
            inherits.$forceUpdate = $forceUpdate;   // 刷新列表专用
            return inherits;
        },

        // ======================= 表单组件 =======================
        /*
         * 「表单」初始化表单专用，表单组成：
         * 1. 前端基本表单
         * 2. 后端 formW（核心业务部分）
         * 3. 前端分派部分
         * 4. 图 / 执行详情
         */
        yiForm: (state = {}, pre = false) => {
            const {$workflow = {}} = reference.props;
            const request = Ux.clone($workflow);
            request.pre = pre;
            if (!pre) {
                // 按实例读取数据
                const {$inited = {}} = reference.props;
                request.instanceId = $inited['flowInstanceId'];
            }
            return Ux.ajaxPost("/api/up/flow-form/:pre", request).then(response => {
                // 表单布局专用（后台可配）
                state.$formW = response.form;
                // 直接合并，用最新的配置覆盖原始配置
                const workflow = Ux.clone($workflow);
                if (response.workflow) {
                    Object.assign(workflow, response.workflow);
                }
                state.$workflow = workflow;
                return Ux.promise(state);
            })
        },
        /*
         * 「表单」添加，提供默认值
         * {
         *     "type": "流程类型",
         *     "openAt": "开单时间"
         * }
         */
        yoFormOpen: ($workflow = {}) => {
            const $inited = {};


            // 特殊参数
            $inited.type = $workflow.type;
            $inited.openAt = Ux.valueNow();


            // 表单配置
            const form = Ch.yoForm(reference, null, $inited);
            form.$mode = Ux.Env.FORM_MODE.ADD;
            return form;
        },
        /*
         * 「表单」编辑，提供值处理，主要处理 record 字段
         * {
         *      "record": {
         *          "field1": "v1",
         *          "field2": "v2"
         *      }
         * }
         * 转换成：
         * {
         *      "record@field1": "v1",
         *      "record@field2": "v2"
         * }
         */
        yoFormObserve: ($workflow = {}) => {
            const {$inited = {}} = reference.props;
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
            const form = Ch.yoForm(reference, null, initialized);
            form.$mode = Ux.Env.FORM_MODE.EDIT;
            return form;
        },


        // acl 控制
        yoAcl: (formConfig = {}) => {
            const {$inited = {}, $edition = true} = reference.props;
            if ($edition) {
                const {acl = {}} = $inited;
                const edition = {};
                if ("boolean" === typeof acl.edition) {
                    // 布尔值
                    if (false === acl.edition) {
                        return false;
                    }
                } else {
                    if (Ux.isObject(acl.edition)) {
                        Object.keys($inited).filter(key => !Ux.isObject($inited[key])).forEach(key => {
                            edition[key] = !!acl.edition[key];
                        })
                        const {form: {ui = []}} = formConfig;
                        ui.forEach(item => item.forEach(cell => {
                            let field = Ux.toFieldName(cell);
                            if (!acl.edition[field]) {
                                edition[field] = false;
                            }
                        }));
                    }
                }
                return edition;
            } else return $edition;
        },

        // ======================= Ko 插件专用 =======================
        yoPlugins: ($workflow) => ({
            // 「List专用」行选择插件
            koSelection: (record) => {
                const user = Ux.isLogged();
                return user.key === record.owner;
            },
            // 「List专用」行操作插件
            koRow: koOp(reference),
            // 「Form专用」编辑表单插件
            koEdit: koOp(reference),
        })
    })
}