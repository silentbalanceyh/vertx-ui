import U from "underscore";
import Ux from "ux";
import Ex from 'ex';

const $opLogin = (reference, callback) => (params) => Ex.I.login(params)
    .then((data = {}) => {
        // 交换授权码专用请求
        const request = {};
        request.client_id = data['key'];
        request.client_secret = data['clientSecret'];
        request.scope = data['scope'];
        // 授权码处理
        return Ex.I.authorize(request);
    })
    .then((data = {}) => {
        // 交换令牌专用请求
        const token = {};
        token.code = data['code'];
        token.client_id = data['client_id'];
        return Ex.I.token(token);
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
            return Ex.promise(user);
        }
    })
    .then((user = {}) => {
        /* 存储用户信息 */
        Ux.storeUser(user);
        /* 先存储一份用户数据，后续请求需要拿 token */
        return Ex.promise(user);
    })
    /* 直接读取员工信息 */
    .then(() => Ex.I.user())
    .then(employee => {
        const user = Ux.isLogged();
        const logged = Object.assign(Ux.clone(user), employee);
        /* 第二次存储 */
        // Fn.syncUser(logged);
        Ux.storeUser(logged);
        /* 重定向 */
        Ux.toOriginal(reference);
    })
    .catch(error => Ex.failure(reference, error));
export default {
    $opLogin,
    ...Ex.Op,
}