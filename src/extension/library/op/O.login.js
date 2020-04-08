import Api from "../ajax";
import Ux from "ux";
import U from "underscore";

/**
 * ## 扩展函数
 *
 * 注销专用操作。
 *
 * @memberOf module:_op
 * @async
 * @param {ReactComponent} reference React对应组件引用。
 * @returns {Promise<T>} 返回最终Promise
 */
const $opLogout = (reference) => Api.logout().then(result => {
    console.info("登出系统！", result);
    // 清除Session
    Ux.toLogout();
    // 路由处理
    Ux.toRoute(reference, Ux.Env.ENTRY_LOGIN);
    // 清除State上的数据
    Ux.writeClean(reference, ['user']);
}).catch(error => Ux.ajaxError(reference, error));
/*
 * ## 扩展函数
 *
 * 登录专用操作。
 *
 * @memberOf module:_op
 * @async
 * @param {ReactComponent} reference React对应组件引用。
 * @returns {Promise<T>} 返回最终Promise
 */
const $opLogin = (reference) => (params) => Api.login(params)
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
        user.token = response['access_token'];
        user.refreshToken = response['refresh_token'];
        user.key = response.key;
        user.username = params.username;
        return Ux.promise(user);
    })
    .then((user = {}) => {
        /* 存储用户信息 */
        Ux.storeUser(user);
        /* 先存储一份用户数据，后续请求需要拿 token */
        return Ux.promise(user);
    })
    /* 直接读取员工信息 */
    .then(() => Api.user())
    .then(employee => {
        const user = Ux.isLogged();
        const logged = Object.assign(Ux.clone(user), employee);
        return Ux.promise(logged);
    })
    .then(logged => {
        // 读取 rxLogin ：外层传入
        const {rxLogin} = reference.props;
        if (U.isFunction(rxLogin)) {
            return rxLogin(logged);
        } else {
            return Ux.promise(logged);
        }
    })
    .then(logged => {
        /* 第二次存储 */
        Ux.storeUser(logged);
        /* Redux防重复提交完成 */
        Ux.writeSubmit(reference, false);
        /* 重定向 */
        Ux.toOriginal(reference);
    });
export default {
    $opLogout,
    $opLogin,
}