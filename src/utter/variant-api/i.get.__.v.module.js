import Ux from 'ux';

export default {
    // failure
    inData: (uri) => ({entry: encodeURI(uri)}),
    // api
    uri: `/api/module`,
    // method
    method: Ux.Env.HTTP_METHOD.GET,
    // catch
}