import Ux from 'ux';

export default {
    // failure
    inData: (request = {}) => ({
        ...request,
        password: Ux.encryptMD5(request.password),      // MD5加密
    }),
    // api
    uri: `/oauth/login`,
    // method
    method: Ux.Env.HTTP_METHOD.POST,
    // catch
}