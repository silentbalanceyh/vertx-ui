import Ux from 'ux';

export default {
    // failure
    inData: (key) => ({key}),
    // api
    uri: `/api/job/resume/:key`,
    // method
    method: Ux.Env.HTTP_METHOD.PUT,
}