import Api from "../ajax";
import Ux from "ux";
import U from "underscore";
import Fn from '../functions';

const $opLogout = (reference) => Api.logout().then(result => {
    console.info("登出系统！", result);
    // 清除Session
    Ux.toLogout();
    // 路由处理
    Ux.toRoute(reference, Ux.Env.ENTRY_LOGIN);
    // 清除State上的数据
    Ux.eraseTree(reference, ['user']);
});
/*
 * 登录框统一使用，目前有两种
 * ExEntry：会员和普通用户专用
 * ExLogin：后台管理员专用（带重置）
 */
const $opLogin = (reference, callback) => (params) => Api.login(params)
    .then((data = {}) => {
        // 交换授权码专用请求
        const request = {};
        request.client_id = data['key'];
        request.client_secret = data['clientSecret'];
        request.scope = data['scope'];
        // 授权码处理
        return Api.authorize(request);
    })
    .then((data = {}) => {
        // 交换令牌专用请求
        const token = {};
        token.code = data['code'];
        token.client_id = data['client_id'];
        return Api.token(token);
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
            return Fn.promise(user);
        }
    })
    .then((user = {}) => {
        /* 存储用户信息 */
        Ux.storeUser(user);
        /* 先存储一份用户数据，后续请求需要拿 token */
        return Fn.promise(user);
    })
    /* 直接读取员工信息 */
    .then(() => Api.user())
    .then(employee => {
        const user = Ux.isLogged();
        const logged = Object.assign(Ux.clone(user), employee);
        /* 第二次存储 */
        console.info(logged, reference);
        Ux.storeUser(logged);
        /* 重定向 */
        Ux.toOriginal(reference);
    })
    .catch(error => Fn.failure(reference, error));
export default {
    $opLogout,
    $opLogin,
}