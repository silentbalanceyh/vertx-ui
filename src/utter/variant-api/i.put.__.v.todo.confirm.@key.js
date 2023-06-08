import Ux from 'ux';

export default {
    // failure
    inData: (params) => ({key: params.key, data: params.data}),
    // api
    uri: `/api/todo/confirm/:key`,
    // method
    method: Ux.Env.HTTP_METHOD.PUT,
    // catch
}