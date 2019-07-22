import Api from '../api';
import Ux from 'ux';
import U from 'underscore';

const login = (reference, callback) => (params) => Api.login(params)
    .then((data = {}) => {
        // 交换授权码专用请求
        const request = {};
        request.client_id = data['key'];
        request.client_secret = data['clientSecret'];
        request.scope = data['scope'];
        // 授权码处理
        return Api.authorize(request).then((authorized = {}) => {
            authorized.client_id = request.client_id;
            return Promise.resolve(authorized);
        });
    })
    .then((data = {}) => {
        // 交换令牌专用请求
        const token = {};
        token.code = data['code'];
        token.client_id = data['client_id'];
        return Api.token(token).then((response) => {
            response.key = token.client_id;
            return Promise.resolve(response);
        })
    })
    .then((response = {}) => {
        // 读取Token信息
        const user = {};
        user.token = response.access_token;
        user.refreshToken = response.refresh_token;
        user.key = response.key;
        user.username = params.username;
        if (U.isFunction(callback)) {
            return callback(user);
        } else {
            return Promise.resolve(user);
        }
    })
    .then((user = {}) => {
        /* 存储用户信息 */
        Ux.storeUser(user);
        /* 先存储一份用户数据，后续请求需要拿 token */
        return Promise.resolve(user);
    })
    /* 直接读取员工信息 */
    .then(() => Api.user())
    .then(employee => {
        const user = Ux.isLogged();
        const logged = Object.assign(Ux.clone(user), employee);
        /* 第二次存储 */
        Ux.storeUser(logged);
        /* 重定向 */
        Ux.toOriginal(reference);
    })
    .catch(error => {
        console.error(error);
    });
export default {
    login,
}