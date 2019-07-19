import Ux from 'ux';

export default {
    /* /oauth/login */
    login: (params = {}) => Ux.ajaxPush('/oauth/login', {
        ...params,
        password: Ux.encryptMD5(params.password)    // MD5加密
    }),
    /* /oauth/authorize */
    authorize: (params = {}) => Ux.ajaxPush('/oauth/authorize', params),
    /* /oauth/token */
    token: (params = {}) => Ux.ajaxPush('/oauth/token', params)
}