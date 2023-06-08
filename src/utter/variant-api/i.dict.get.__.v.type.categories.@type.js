import Ux from 'ux';

export default {
    // failure
    inData: (params) => params,
    // api
    uri: `/api/type/categories/:type`,
    // method
    method: Ux.Env.HTTP_METHOD.GET,
    // catch
}