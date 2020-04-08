import Ux from "ux";

/**
 * 登录专用类，用于渲染 username / password，注入键盘事件
 *
 * * 给 `username` 和 `password` 设置键盘事件。
 * * 在输入过程中，使用回车触发提交操作。
 *
 * 调用方法
 *
 * ```js
 * // 非法处理
 * const login = new Login();
 *
 * // 合法处理（框架内部代码）
 * import Ux from 'ex';
 * import Ex from 'ex';
 *
 * &#64;Ux.zero(Ux.rxEtat(require('./Cab.json'))
 *      .cab("ExLogin")
 *      .form().raft(1).raft(Ex.Jsx.Login)
 *      .bind(Ex.Op)
 *      .to()
 * )
 * ```
 *
 * @class Login
 */
class Login {
    /**
     * 渲染用户名，在Jsx中注入`onPressEnter`事件
     *
     * @param {ReactComponent} reference React对应组件引用。
     * @param {optionJsx} jsx 输入的jsx配置。
     * @returns {Jsx}
     */
    static username(reference, jsx) {
        jsx.onPressEnter = (event) => {
            Ux.prevent(event);
            Ux.connectId("$opLogin");
        };
        return Ux.aiInput(reference, jsx);
    }

    /**
     * 渲染密码，在Jsx中注入`onPressEnter`事件
     *
     * @param {ReactComponent} reference React对应组件引用。
     * @param {optionJsx} jsx 输入的jsx配置。
     * @returns {Jsx}
     */
    static password(reference, jsx) {
        jsx.onPressEnter = (event) => {
            Ux.prevent(event);
            Ux.connectId("$opLogin");
        };
        return Ux.aiInput(reference, jsx);
    }
}

export default Login;