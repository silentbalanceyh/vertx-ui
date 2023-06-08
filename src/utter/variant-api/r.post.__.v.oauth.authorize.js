import Ux from 'ux';

export default {
    // failure
    inData: (request = {}) => request,
    // api
    uri: `/oauth/authorize`,
    // method
    method: Ux.Env.HTTP_METHOD.POST,
    // catch
    outData: (authorized, request = {}) => {
        /* 追加 authorized 中的 client_id */
        authorized.client_id = request.client_id;
        return Ux.promise(authorized);
    }
}