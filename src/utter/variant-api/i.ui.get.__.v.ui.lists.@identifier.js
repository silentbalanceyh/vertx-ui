import Ux from 'ux';

export default {
    // failure
    inData: (identifier) => ({identifier}),
    // api
    uri: `/api/ui/lists/:identifier`,
    // method
    method: Ux.Env.HTTP_METHOD.GET,
}