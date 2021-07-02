import Ux from "ux";
import I from "../ajax";
import Fn from "./generator";
import G from "./global";

const tabular = (reference, define = false) => {
    /* 定义信息 */
    if (define) {
        const define = {};
        define.name = "tabular";
        define.uri = "/api/types/tabulars";
        define.method = "POST";
        define.magic = {
            $body: []
        }
        define.group = "type";
        return Ux.promise(define);
    } else {
        // 注意两个地方返回的都是 tabular，这里是元数据
        return I.tabular({type: G.V.TYPE_TABULAR});
    }
}
const category = (reference, define = false) => {
    if (define) {
        const define = {};
        define.name = "category";
        define.uri = "/api/types/categories";
        define.method = "POST";
        define.magic = {
            $body: []
        }
        define.group = "type";
        return Ux.promise(define);
    } else {
        // 注意两个地方返回的都是 tabular，这里是元数据
        return I.tabular({type: G.V.TYPE_CATEGORY});
    }
}
// =====================================================
// io 专用，in / out前缀
// =====================================================
/**
 * ## 「输入」`Ex.inApi`
 *
 * 任务处理输入
 *
 * @memberOf module:_kernel
 * @param {Object} uri 任务配置
 * @returns {Object} 处理过的任务数据
 */
const inApi = (uri = {}) => {
    const {service = {}, api = {}} = uri;
    if (api.key) {
        const processed = {};
        processed.name = api.name;
        processed.type = api.type;
        processed.comment = api.comment;
        processed.uri = api.uri;
        processed.method = api.method;
        processed.secure = api.secure;
        // MIME
        // eslint-disable-next-line
        {
            processed.consumes = api.consumes;
            processed.produces = api.produces;
        }
        // param
        // eslint-disable-next-line
        {
            processed.paramMode = api.paramMode;
            processed.paramRequired = api.paramRequired;
            processed.paramContained = api.paramContained;
        }
        // Worker
        // eslint-disable-next-line
        {
            processed.workerType = api.workerType;
            processed.workerAddress = api.workerAddress;
            processed.workerConsumer = api.workerConsumer;
            processed.workerClass = api.workerClass;
            processed.workerJs = api.workerJs;
        }
        // IN/OUT
        // eslint-disable-next-line
        {
            processed.inRule = api.inRule;
            processed.inMapping = api.inMapping;
            processed.inPlug = api.inPlug;
            processed.inScript = api.inScript;
            processed.outWriter = api.outWriter;
        }
        /*
         * 基本信息
         */
        processed.key = api.key;
        processed.code = api.code;

        inApiService(processed, service);
        return processed;
    } else return {};
};

const inApiService = (processed = {}, service = {}) => {
    /*
     * 模型Id，名空间，服务ID
     */
    processed.modelId = service.identifier;
    processed.namespace = service.namespace;
    processed.serviceId = service.key;
    /*
     * 业务配置信息
     * service - 业务组件配置
     * channel - 通道配置
     * dict - 字典配置
     * mapping - 映射配置
     * identifier - ID选择器配置
     */
    processed.ruleUnique = service.ruleUnique;
    processed.serviceRecord = service.serviceRecord;
    processed.serviceComponent = service.serviceComponent;
    processed.serviceConfig = service.serviceConfig;

    processed.channelType = service.channelType;
    processed.channelComponent = service.channelComponent;
    processed.channelConfig = service.channelConfig;

    processed.dictComponent = service.dictComponent;
    processed.dictConfig = service.dictConfig;

    processed.mappingMode = service.mappingMode;
    processed.mappingComponent = service.mappingComponent;
    processed.mappingConfig = service.mappingConfig;

    processed.identifier = service.identifier;
    processed.identifierComponent = service.identifierComponent;

    processed.configDatabase = service.configDatabase;
    processed.configIntegration = service.configIntegration;
};
/**
 *
 * ## 「输出」`Ex.outApi`
 *
 * 任务处理输出
 *
 * @memberOf module:_kernel
 * @param {Object} params 提交之前原始任务数据
 * @returns {Object} 任务输出数据
 */
const outApi = (params = {}) => {
    const request = {};
    const {
        modelId,
        serviceId,
        serviceRecord,
        serviceComponent,
        serviceConfig,
        identifier,
        identifierComponent,
        channelType,
        channelComponent,
        channelConfig,
        dictComponent,
        dictConfig,
        mappingMode,
        mappingComponent,
        mappingConfig,
        configDatabase,
        configIntegration,
        ...api
    } = params;
    request.api = api;
    request.service = {
        modelId,
        key: serviceId,
        serviceRecord,
        serviceComponent,
        serviceConfig,
        identifier,
        identifierComponent,
        channelType,
        channelComponent,
        channelConfig,
        dictComponent,
        dictConfig,
        mappingMode,
        mappingComponent,
        mappingConfig,
        configDatabase,
        configIntegration,
    };
    return request;
};

/**
 * ## 「输入」`Ex.inJob`
 *
 * 任务处理输入
 *
 * @memberOf module:_kernel
 * @param {Object} mission 任务配置
 * @returns {Object} 处理过的任务数据
 */
const inJob = (mission = {}) => {
    const {metadata = {}} = mission;
    const {service = {}, job = {}} = metadata;
    if (job.key) {
        const processed = {};
        processed.name = mission.name;
        processed.type = mission.type;
        processed.opKey = mission.code;
        processed.status = mission.status;
        processed.comment = mission.comment;
        /*
         * 任务的基本信息
         */
        processed.key = job.key;
        processed.code = job.code;
        if ("ONCE" === mission.type) {
            processed.threshold = job.threshold;
        } else {
            processed.duration = job.duration;
            processed.threshold = job.threshold;
            if ("FIXED" === mission.type) {
                processed.runAt = job.runAt;
            }
        }
        /*
         * 特殊任务
         */
        // eslint-disable-next-line
        {
            processed.comment = job.comment;
            processed.proxy = job.proxy;
            processed.incomeAddress = job.incomeAddress;
            processed.incomeComponent = job.incomeComponent;
            processed.outcomeAddress = job.outcomeAddress;
            processed.outcomeComponent = job.outcomeComponent;
        }
        /*
         * 特殊ID
         */
        processed.jobId = job.key;
        /*
         * 特殊对象
         */
        processed.job = Ux.clone(job);
        inJobService(processed, service);
        return processed;
    } else return {};
};

const inJobService = (processed = {}, service = {}) => {
    /*
     * 模型Id，名空间，服务ID
     */
    processed.modelId = service.identifier;
    processed.namespace = service.namespace;
    processed.serviceId = service.key;
    /*
     * 业务配置信息
     * service - 业务组件配置
     * channel - 通道配置
     * dict - 字典配置
     * mapping - 映射配置
     * identifier - ID选择器配置
     */
    processed.ruleUnique = service.ruleUnique;
    processed.serviceRecord = service.serviceRecord;
    processed.serviceComponent = service.serviceComponent;
    processed.serviceConfig = service.serviceConfig;

    processed.channelType = service.channelType;
    processed.channelComponent = service.channelComponent;
    processed.channelConfig = service.channelConfig;

    processed.dictComponent = service.dictComponent;
    processed.dictConfig = service.dictConfig;

    processed.mappingMode = service.mappingMode;
    processed.mappingComponent = service.mappingComponent;
    processed.mappingConfig = service.mappingConfig;

    processed.identifier = service.identifier;
    processed.identifierComponent = service.identifierComponent;

    processed.configDatabase = service.configDatabase;
    processed.configIntegration = service.configIntegration;
};
/**
 *
 * ## 「输出」`Ex.outJob`
 *
 * 任务处理输出
 *
 * @memberOf module:_kernel
 * @param {Object} params 提交之前原始任务数据
 * @returns {Object} 任务输出数据
 */
const outJob = (params = {}) => {
    const request = {};
    const {
        modelId,
        serviceId,
        serviceRecord,
        serviceComponent,
        serviceConfig,
        identifier,
        identifierComponent,
        channelType,
        channelComponent,
        channelConfig,
        dictComponent,
        dictConfig,
        mappingMode,
        mappingComponent,
        mappingConfig,
        configDatabase,
        configIntegration,
        ...job
    } = params;
    Object.assign(request, job);
    request.service = {
        modelId,
        key: serviceId,
        serviceRecord,
        serviceComponent,
        serviceConfig,
        identifier,
        identifierComponent,
        channelType,
        channelComponent,
        channelConfig,
        dictComponent,
        dictConfig,
        mappingMode,
        mappingComponent,
        mappingConfig,
        configDatabase,
        configIntegration,
    };
    return request;
};
export default {
    /**
     * ## 「内部类」`Ex.form`
     *
     * 根据 `reference` 执行表单操作
     *
     * ```json
     * {
     *     add: (params) => Promise,
     *     save: (params) => Promise,
     *     remove: (params) => Promise,
     *     filter: (params) => Promise,
     *     query: (params) => Promise,
     *     wizard: (params) => Promise
     * }
     * ```
     *
     * ### 函数说明
     *
     * | 函数名 | 说明 |
     * |:---|:---|
     * | add | 添加表单提交 |
     * | save | 保存表单提交 |
     * | remove | 删除表单提交 |
     * | filter | 高级搜索查询条件处理 |
     * | query | 直接搜索表单处理 |
     * | wizard | 步骤表单提交 |
     *
     * 当前API的框架内部调用代码如：
     *
     * ```js
     * import Ex from 'ex';
     *
     * const $opAdd = (reference) => params => Ex.form(reference).add(params, {
     *      uri: "/api/role",
     *      dialog: "added",
     * });
     * ```
     *
     * @memberOf module:_kernel
     * @method form
     * @param {ReactComponent} reference React对应组件引用
     * @returns {Object} 返回对象信息
     * */
    form: (reference) => ({
        add: (params = {}, config = {}) => {
            let request = Ux.valueRequest(params);
            const {$addKey} = reference.props;
            request.key = $addKey;
            request = Ux.valueValid(request);
            return Ux.ajaxPost(config.uri, request)
                .then(Ux.ajax2Dialog(reference, config.dialog))
                .then(response => Fn.rx(reference, config.off).close(response))
                .catch(error => Ux.ajaxError(reference, error));
        },
        save: (params = {}, config = {}) => {
            const {$inited = {}} = reference['props'];
            // 先将表单有的值合并到初始值
            const input = Object.assign({}, $inited, params);
            let request = Ux.valueRequest(input);
            request = Ux.valueValid(request);
            return Ux.ajaxPut(config.uri, request)
                .then(Ux.ajax2Dialog(reference, config.dialog))
                .then(response => Fn.rx(reference, config.off).close(response))
                .catch(error => Ux.ajaxError(reference, error));
        },
        remove: (params = {}, config = {}) => {
            const input = {key: params.key};
            return Ux.ajaxDelete(config.uri, input)
                .then(Ux.ajax2Dialog(reference, config.dialog))
                .then(Ux.ajax2True(
                    () => Fn.rx(reference, config.off).close(params, {
                        $selected: []
                    })
                ))
                .catch(error => Ux.ajaxError(reference, error));
        },
        filter: (params = {}) => {
            const {connector = "AND", ...rest} = params;
            const values = Ux.qrForm(rest, connector, reference);
            /*
             * 注意双参数
             */
            Fn.rx(reference).filter(values, params);    // 维持数据专用
            return Ux.promise(values)
                .then(response => Fn.rx(reference).close(response))
                .catch(error => Ux.ajaxError(reference, error));
        },
        query: (params = {}, filters = {}) => {
            params = Ux.valueValid(params);
            const {connector = "AND", ...rest} = params;
            const values = Ux.qrForm(rest, connector, reference);
            const query = {};
            query.form = Ux.clone(params);
            if (Ux.isEmpty(filters)) {
                query.condition = values;
            } else {
                const request = {};
                request["$filters"] = filters;
                request[""] = true;
                request["$condition"] = values;
                query.condition = request;
            }
            query.request = Ux.clone(values);
            return Ux.promise(query);
        },
        wizard: (params, promiseSupplier) => {
            const {rxFailure} = reference.props;
            const filters = Ux.valueValid(params);
            if (0 < Object.keys(filters).length) {
                const request = {};
                /*
                 * 默认带 sigma 支持多应用处理
                 */
                const condition = {"": true, ...filters};
                if (!condition.sigma) {
                    const app = Ux.isInit();
                    if (app.sigma) {
                        condition.sigma = app.sigma;
                    }
                }
                request.criteria = condition;
                if (Ux.isFunction(promiseSupplier)) {
                    const promise = promiseSupplier(request);
                    return promise.then(result => {
                        if (!result || 0 === result.length) {
                            if (Ux.isFunction(rxFailure)) {
                                rxFailure(() => reference.setState({
                                    $loading: false, $submitting: false
                                }), false);
                            }
                        } else {
                            const {rxSubmit} = reference.props;
                            if (Ux.isFunction(rxSubmit)) {
                                /*
                                 * 关闭防重复提交
                                 */
                                reference.setState({
                                    $loading: false, $submitting: false
                                });
                                return rxSubmit(result, reference);
                            } else {
                                throw new Error("[ Ex ] wizard调用非法，缺失 rxSubmit主方法");
                            }
                        }
                    })
                } else {
                    throw new Error("[ Ex ] wizard调用非法，缺失 promiseSupplier");
                }
            } else {
                if (Ux.isFunction(rxFailure)) {
                    return rxFailure(() => reference.setState({
                        $loading: false, $submitting: false
                    }));
                }
            }
        },
    }),

    /**
     * ## 「内部类」`Ex.dialog`
     *
     * 根据 `reference` 执行窗口操作
     *
     * ```json
     * {
     *     add: (data) => Promise,
     *     save: (data) => Promise,
     *     saveRow: (data) => Promise,
     *     saveSelected: (data) => Promise
     * }
     * ```
     *
     * ### 函数说明
     *
     * | 函数名 | 说明 |
     * |:---|:---|
     * | add | 窗口添加执行 |
     * | save | 窗口保存执行 |
     * | saveRow | 保存当前行 |
     * | saveSelected | 保存当前窗口选择的 |
     *
     * 当前API的框架内部调用代码如：
     *
     * ```js
     * import Ex from 'ex';
     *
     * const $opSaveField = (reference) => params =>
     *      Ex.dialog(reference).saveRow(params);
     * ```
     *
     * @memberOf module:_kernel
     * @method dialog
     * @param {ReactComponent} reference React对应组件引用
     * @returns {Object} 返回对象信息
     * */
    dialog: (reference) => ({
        add: (params = {}, config = {}) => {
            let request = Ux.valueRequest(params);
            request = Ux.valueValid(request);
            return Ux.ajaxPost(config.uri, request)
                .then(Ux.ajax2Message(reference, config.dialog))
                .then(response => {
                    Fn.rx(reference).close(response);
                    return Ux.promise(response);
                })
        },
        save: (params = {}, config = {}) => {
            let request = Ux.valueRequest(params);
            request = Ux.valueValid(request);
            return Ux.ajaxPut(config.uri, request)
                .then(Ux.ajax2Message(reference, config.dialog))
                .then(response => {
                    Fn.rx(reference).close(response);
                    return Ux.promise(response);
                })
        },
        saveRow: (params = {}, config = {}) => {
            let request = Ux.valueRequest(params);
            const {doRow} = reference.props;
            if (Ux.isFunction(doRow)) {
                const {$mode = ""} = reference.props;
                if (Ux.Env.FORM_MODE.ADD === $mode && !config.close) {
                    /*
                     * 重置当前表单
                     */
                    Ux.formReset(reference);
                    /*
                     * 根据初始值需要得到一条新数据
                     */
                    let {$inited = {}} = reference.props;
                    $inited = Ux.clone($inited);
                    $inited.key = Ux.randomUUID();
                    /*
                     * 变更 key
                     */
                    doRow(request, {
                        $submitting: false, // 关闭提交
                        $inited,            // 继续添加，处于添加模式比较特殊
                    });
                } else {
                    doRow(request, {
                        $visible: false, // 关闭窗口
                        $submitting: false, // 关闭提交
                    });
                }
                /*
                 * 提交专用（防止重复提交问题）
                 */
                reference.setState({$loading: false});
            } else {
                throw new Error("[ Ux ] 缺失核心函数 doRow()");
            }
            return Ux.promise(request);
        },
        saveSelected: (data = []) => {
            const {doRows} = reference.props;
            if (Ux.isFunction(doRows)) {
                doRows(data, {
                    $visible: false, // 关闭窗口
                })
            } else {
                throw new Error("[ Ux ] 缺失核心函数 doRow()");
            }
        }
    }),


    /**
     * ## 「内部类」`Ex.init`
     *
     * 根据 `reference` 执行初始化
     *
     * ```json
     * {
     *     "company": () => Promise
     * }
     * ```
     *
     * ### 函数说明
     *
     * | 函数名 | 说明 |
     * |:---|:---|
     * | company | 企业信息初始化 |
     *
     * @memberOf module:_kernel
     * @method init
     * @param {ReactComponent} reference React对应组件引用
     * @returns {Object} 返回最终数据
     */
    init: (reference) => ({
        /*
         * 企业信息读取，两个地方需要用到
         * 1）企业信息管理：/organization/company
         * 2）企业信息查看：/personal/company
         */
        company: () => {
            reference.setState({$ready: false});
            I.company().then($inited => reference.setState({
                $ready: true, $inited
            })).catch($error => reference.setState({$ready: true, $error}))
        }
    }),

    /**
     * ## 「内部类」`Ex.designer`
     *
     * 图编辑器专用（文档暂时不提供）
     *
     * @memberOf module:_kernel
     * @param reference
     * @returns {Object}
     */
    designer: (reference) => ({
        rxType: (params, define = false) => {
            const {type} = params;
            if ("TABULAR" === type) {
                return tabular(reference, define);
            } else if ("CATEGORY" === type) {
                return category(reference, define);
            } else {
                console.error("检查参数对应信息：", params);
                throw new Error("请检查参数信息！")
            }
        },
        rxApi: (keyword) => {
            if (keyword) {
                return Ux.ajaxPost(`/api/action/seek`, {keyword});
            } else return Ux.promise([]);
        },
        rxUri: (keyword) => {
            if (keyword) {
                return Ux.ajaxPost(`/api/action/ready`, {keyword});
            } else return Ux.promise([]);
        },
        rxSubmit: (params, fnCallback) => {
            // console.info(params, reference.props);
            const {$inited = {}} = reference.props;    // 原始表单
            const request = Ux.clone($inited);
            if (request.key) {
                // 构造请求中的核心数据
                {
                    // 基础属性
                    request.window = params.window;
                    request.columns = params.columns;
                    if (Ux.isArray(params.hidden)) {
                        request.hidden = params.hidden;
                    }
                    const metadata = {};
                    if (!request.metadata) {
                        // 如果没有任何 metadata 则初始化一份
                        Object.assign(metadata, {
                            deletion: true,     // 可删除
                            edition: true,      // 可编辑
                            design: true        // 可设计
                        });
                    } else {
                        Object.assign(metadata, request.metadata);
                    }
                    // 在 metadata 中挂载 initial 节点
                    if (params.initial && !Ux.isEmpty(params.initial)) {
                        metadata.initial = params.initial;
                    }
                    // 在 metadata 中挂载 assist 节点
                    if (params.assist && !Ux.isEmpty(params.assist)) {
                        metadata.assist = params.assist;
                    }
                    // 创建类，没有 key 值
                    request.metadata = metadata;
                }
                {
                    // 构造 op 相关信息
                    if (params.actions) {
                        // ops 的数组构造（当前表单所有提交类的OP信息）
                        const ops = [];
                        Object.keys(params.actions).forEach(opKey => {
                            ops.push(Ux.clone(params.actions[opKey]));
                        });
                        request.ops = ops;
                    }
                    // 构造 fields 相关信息
                    const fields = [];
                    params.ui.forEach((row, rowIndex) => row.forEach((cell, cellIndex) => {
                        const field = {key: Ux.randomUUID()};
                        /*
                         *  key:            自动生成
                         *  xPoint:         列坐标
                         *  yPoint:         行坐标
                         *  label:          optionItem.label
                         *  name:           field
                         *  span:           span
                         *  hidden:         hidden（是否隐藏）
                         *  render:         render 的值
                         *  optionJsx：     直接读取
                         *  optionConfig:   除开 rules 之后的值
                         *  optionItem:     除开 label 之后的值（包括除去布局字段）
                         *  rules:          验证规则，从 optionConfig 中提取
                         *  controlId:      后端计算
                         *  rowType:        FIELD / TITLE
                         *  active:         默认 true
                         *  sigma:          直接从表单中读
                         *  language:       直接从表单中读
                         */
                        field.xPoint = cellIndex;
                        field.yPoint = rowIndex;

                        field.active = true;
                        field.sigma = request.sigma;
                        field.language = request.language;

                        field.span = cell.span; // 该值必须有

                        // 基础配置
                        if (cell.optionJsx) {
                            field.optionJsx = Ux.clone(cell.optionJsx);
                        }

                        // optionItem 拆
                        if (cell.hasOwnProperty("title")) {
                            // 标题处理
                            field.rowType = "TITLE";
                            field.hidden = false;
                            field.label = cell.title;
                        } else {
                            // 字段处理
                            field.rowType = "FIELD";
                            field.render = cell.render; // 该值在这里必须存在
                            if (0 < cell.field.indexOf(',')) {
                                field.name = cell.field.replace(',', '`');    // 该值在这里必须存在
                            } else {
                                field.name = cell.field;    // 该值在这里必须存在
                            }
                            if (cell.hidden) {
                                field.hidden = cell.hidden;
                            } else {
                                field.hidden = false;
                            }
                            // field.field = cell.field;
                            // optionItem
                            const $optionItem = Ux.clone(cell.optionItem);
                            const {label, ...rest} = $optionItem;
                            field.label = label;

                            if (rest.style) delete rest.style;
                            if (rest.labelCol) delete rest.labelCol;
                            if (rest.wrapperCol) delete rest.wrapperCol;

                            field.optionItem = rest;
                            // optionConfig
                            if (cell.optionConfig) {
                                const $optionConfig = Ux.clone(cell.optionConfig);
                                const {rules = [], ...restConfig} = $optionConfig;
                                field.rules = rules;
                                field.optionConfig = restConfig;
                            } else {
                                field.rules = null;
                                field.optionConfig = null;
                            }
                        }
                        fields.push(field);
                    }));
                    request.fields = fields;
                }
                return Ux.ajaxPut("/api/ui-form/cascade/:key", request).then(response => {
                    // 弹出窗口
                    Ux.sexDialog(reference, "designed", () => {
                        // 内置关闭
                        fnCallback();
                        // rxClose 调用
                        Ux.fn(reference).rxClose();
                    })
                });
            } else {
                console.error("异常，没有表单的原始信息！", request.key);
            }
        }
    }),
    // in / out
    inApi,
    inJob,
    outApi,
    outJob,
}