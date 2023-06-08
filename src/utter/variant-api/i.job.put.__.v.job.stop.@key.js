import Ux from 'ux';

export default {
    // failure
    inData: (key) => ({key}),
    // api
    uri: `/api/job/stop/:key`,
    // method
    method: Ux.Env.HTTP_METHOD.PUT,
}