import Ux from 'ux';

export default {
    /* /oauth/login */
    login: (request = {}) => Ux.ajaxPush('/oauth/login', {
        ...request,
        password: Ux.encryptMD5(request.password)    // MD5加密
    }),
    /* /api/oauth/logout */
    logout: () => Ux.ajaxPost('/api/user/logout', {})
        .catch(error => {
            console.error(error);
            return Ux.promise({unauthorized: true})
        }),
    /* /oauth/authorize */
    authorize: (request = {}) => Ux.ajaxPush('/oauth/authorize', request)
        .then(authorized => {
            /* 追加 authorized 中的 client_id */
            authorized.client_id = request.client_id;
            return Ux.promise(authorized);
        }),
    /* /oauth/token */
    token: (request = {}) => Ux.ajaxPush('/oauth/token', request)
        .then(token => {
            token.key = request.client_id;
            return Ux.promise(token);
        })
}