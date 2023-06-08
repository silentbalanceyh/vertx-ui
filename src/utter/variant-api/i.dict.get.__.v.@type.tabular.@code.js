import Ux from 'ux';

export default {
    // failure
    inData: (params) => params,
    // api
    uri: `/api/:type/tabular/:code`,
    // method
    method: Ux.Env.HTTP_METHOD.GET,
    // catch
}