import Ux from 'ux';

export default {
    // failure
    inData: (relations = []) => ({$body: relations}),
    // api
    uri: `/api/ox/relation/save`,
    // method
    method: Ux.Env.HTTP_METHOD.POST,
    // catch
}