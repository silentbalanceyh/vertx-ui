import Ux from 'ux';

export default {
    // failure
    inData: (params) => params,
    // api
    uri: `/api/form/actions`,
    // method
    method: Ux.Env.HTTP_METHOD.POST,
    // catch
}