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
    outApi,
    outJob,
}