import Ux from 'ux';

export default {
    // failure
    inData: (params) => ({
        /*
         * Token中已经包含了用户的 id
         * 所以此处只需要 password 就可以了
         */
        password: Ux.encryptMD5(params.password)
    }),
    // api
    uri: `/api/user/password`,
    // method
    method: Ux.Env.HTTP_METHOD.POST,
    // catch
}