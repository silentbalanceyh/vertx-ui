import I from "../ajax";
import Ux from "ux";

/**
 * ## 「操作」`Ex.Op.$opLogout`
 *
 * 注销专用操作。
 *
 * @memberOf module:_business
 * @async
 * @param {ReactComponent} reference React对应组件引用。
 * @returns {Promise<T>} 返回最终Promise
 */
const $opLogout = (reference) => I.logout().then(result => {
    console.info("登出系统！", result);
    // 清除Session
    Ux.toLogout();
    // 路由处理
    Ux.toRoute(reference, Ux.Env.ENTRY_LOGIN, {mid: null, pid: null});
    // 清除State上的数据
    Ux.writeClean(reference, ['user']);
}).catch(error => Ux.ajaxError(reference, error));
/*
 * ## 「操作」`Ex.Op.$opLogin`
 *
 * 登录专用操作。
 *
 * @memberOf module:_business
 * @async
 * @param {ReactComponent} reference React对应组件引用。
 * @returns {Promise<T>} 返回最终Promise
 */
const $opLogin = (reference) => (params) => I.login(params)
    .then((data = {}) => {
        // 交换授权码专用请求
        const request = {};
        request.client_id = data['key'];
        request.client_secret = data['clientSecret'];
        request.scope = data['scope'];
        // 授权码处理
        return I.authorize(request);
    })
    .then((data = {}) => {
        // 交换令牌专用请求
        const token = {};
        token.code = data['code'];
        token.client_id = data['client_id'];
        return I.token(token);
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
    .then(() => I.user())
    .then(employee => {
        const user = Ux.isLogged();
        const logged = Object.assign(Ux.clone(user), employee);
        return Ux.promise(logged);
    })
    .then(logged => {
        // 读取 rxLogin ：外层传入
        const {rxLogin} = reference.props;
        if (Ux.isFunction(rxLogin)) {
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
/**
 * ## 业务模块
 *
 * 带各种业务操作的专用模块
 *
 * @module _business
 */
export default {
    $opLogin,
    $opLogout,
}