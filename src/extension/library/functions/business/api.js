/**
 * ## 扩展函数
 *
 * 任务处理输入
 *
 * @memberOf module:_io
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
        {
            processed.consumes = api.consumes;
            processed.produces = api.produces;
        }
        // param
        {
            processed.paramMode = api.paramMode;
            processed.paramRequired = api.paramRequired;
            processed.paramContained = api.paramContained;
        }
        // Worker
        {
            processed.workerType = api.workerType;
            processed.workerAddress = api.workerAddress;
            processed.workerConsumer = api.workerConsumer;
            processed.workerClass = api.workerClass;
            processed.workerJs = api.workerJs;
        }
        // IN/OUT
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

        inService(processed, service);
        return processed;
    } else return {};
};

const inService = (processed = {}, service = {}) => {
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
 * ## 扩展函数
 *
 * 任务处理输出
 *
 * @memberOf module:_io
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
export default {
    inApi,
    outApi,
}