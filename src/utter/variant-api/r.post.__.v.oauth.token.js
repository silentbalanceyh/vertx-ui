import Ux from 'ux';

export default {
    // failure
    inData: (request = {}) => request,
    // api
    uri: `/oauth/token`,
    // method
    method: Ux.Env.HTTP_METHOD.POST,
    // catch
    outData: (token, request = {}) => {
        token.key = request.client_id;
        return Ux.promise(token);
    }
}