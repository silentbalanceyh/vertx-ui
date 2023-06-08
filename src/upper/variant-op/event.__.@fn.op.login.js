import Ux from "ux";
import {_I} from 'zet';

export default (reference) => {
    let pwdChange = false;
    return (params) => {
        const password = params.password;
        // 验证码专用
        const headers = {};
        const {$session} = reference.state ? reference.state : {};
        if ($session) {
            headers[Ux.Env.X_HEADER.X_SESSION] = $session;
        }
        return _I.login(params, {headers})
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
                return _I.authorize(request);
            })
            .then((data = {}) => {
                // 交换令牌专用请求
                const token = {};
                token.code = data['code'];
                token.client_id = data['client_id'];
                return _I.token(token);
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
            .then(() => _I.user())
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
                // 特殊流程（一旦登录失败刷新验证码）
                if ($session) {
                    error.callback = () => {
                        const session = Ux.randomString(48);
                        Ux.of(reference).in({
                            $session: session
                        }).done();
                        // reference.?etState({$session: session});
                    }
                }
                return Promise.reject(error);
            });
    }
}