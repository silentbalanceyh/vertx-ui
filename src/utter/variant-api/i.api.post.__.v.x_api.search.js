import Ux from 'ux';

export default {
    // failure
    inData: (params = {}) => {
        const request = Ux.clone(params);
        request.criteria[""] = true;
        return request;
    },
    // api
    uri: `/api/x-api/search`,
    // method
    method: Ux.Env.HTTP_METHOD.POST,
}