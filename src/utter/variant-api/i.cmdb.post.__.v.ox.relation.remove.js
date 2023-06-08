import Ux from 'ux';

export default {
    // failure
    inData: (keys = []) => ({$body: keys}),
    // api
    uri: `/api/ox/relation/remove`,
    // method
    method: Ux.Env.HTTP_METHOD.POST,
    // catch
}