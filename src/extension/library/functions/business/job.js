import Ux from "ux";

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
    inJob,
    outJob,
}