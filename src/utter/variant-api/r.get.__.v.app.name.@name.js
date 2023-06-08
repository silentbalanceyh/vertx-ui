import Ux from 'ux';

export default {
    // failure
    inData: () => ({name: Ux.Env.APP}),
    // api
    uri: `/app/name/:name`,
    // method
    method: Ux.Env.HTTP_METHOD.GET,
    // catch
}