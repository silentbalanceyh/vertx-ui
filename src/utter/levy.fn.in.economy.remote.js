import Ux from 'ux';
/* I_API mapping code logical */
const __inApi = (processed = {}, service = {}) => {
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

        __inApi(processed, service);
        return processed;
    } else return {};
};
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
        __inJob(processed, service);
        return processed;
    } else return {};
};

const __inJob = (processed = {}, service = {}) => {
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
const inSettlement = (data = {}) => {
    if (data['relatedId']) {
        // 大于36的情况（跨订单）orderId - orderId - etc
        // 等于36的情况，直接结算
        data.cross = 36 < data['relatedId'].length
    }
    return data;
};
export default {
    inSettlement,
    inApi,
    inJob,
}