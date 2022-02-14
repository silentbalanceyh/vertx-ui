import I from "./ajax";
import Ux from "ux";


/**
 * # 业务操作对象
 *
 * 带各种业务操作的专用模块，该模块内的函数全部使用Zero Ui基础规范`$op`前缀的Promise函数。
 *
 * ## 操作列表
 *
 * |函数|说明|
 * |:---|:---|
 * |$opLogin|OAuth登录专用Promise。|
 * |$opLogout|OAuth注销专用Promise。|
 *
 * @class Op
 */
class Op {
    /**
     * ## 「操作」`Ex.Op.$opLogout`
     *
     * 注销专用操作。
     *
     * @async
     * @param {Object} reference React对应组件引用。
     * @returns {Promise<T>} 返回最终Promise
     */
    static $opLogout(reference) {
        return I.logout()
            .then(item => Ux.DevTool(reference).clean(item))
            .then(result => {
                // console.info("登出系统！", result);
                // 清除Session
                Ux.toLogout();
                // 路由处理
                Ux.toRoute(reference, Ux.Env.ENTRY_LOGIN, {mid: null, pid: null});
                // 清除State上的数据
                Ux.writeClean(reference, ['user']);
            }).catch(error => Ux.ajaxError(reference, error));
    }

    /**
     * ## 「操作」`Ex.Op.$opLogin`
     *
     * 登录专用操作。
     *
     * @async
     * @param {Object} reference React对应组件引用。
     * @returns {function(*=): Promise<T>} 返回最终Promise
     */
    static $opLogin(reference) {
        let pwdChange = false;
        return (params) => {
            const password = params.password;
            // 验证码专用
            const headers = {};
            const {$session} = reference.state ? reference.state : {};
            if ($session) {
                headers[Ux.Env.X_HEADER.X_SESSION] = $session;
            }
            return I.login(params, {headers})
                .then((data = {}) => {
                    // 交换授权码专用请求
                    const request = {};
                    request.client_id = data['key'];
                    request.client_secret = data['clientSecret'];
                    request.scope = data['scope'];
                    if (data.hasOwnProperty('password')) {
                        // 是否初始登录修改密码
                        pwdChange = !data['password'];
                    }
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
                    /* Redux防重复提交完成 */
                    Ux.writeSubmit(reference, false);
                    /* 定向地址 */
                    if (pwdChange) {
                        /* 重定向到密码更改页 */
                        logged.password = password;
                        logged.limitation = pwdChange;
                        /* 第二次存储 */
                        Ux.storeUser(logged);
                        Ux.toPassword(reference);
                    } else {
                        /* 第二次存储 */
                        Ux.storeUser(logged);
                        Ux.toOriginal(reference);
                    }
                })
                .catch(error => {
                    const {data = {}} = error;
                    if (-80222 === data.code) {
                        const session = Ux.randomString(48);
                        Ux.Session.put(Ux.Env.X_SESSION, session);
                    }
                    return Promise.reject(error);
                });
        }
    }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    $opLogin: Op.$opLogin,
    $opLogout: Op.$opLogout,
}