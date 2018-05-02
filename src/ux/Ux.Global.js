import Store from './Ux.Store';
import Cv from './Ux.Constant';

/**
 * 检查环境变量中的Session值判断用户是否登录
 * @method isLogged
 * @return {*}
 */
const isLogged = () => {
    const key = Cv.KEY_USER;
    let userData = Store.Session.get(key);
    if (!userData) userData = {};
    return userData;
};
/**
 * 当前应用是否初始化完成，初始化完成后将应用配置放到应用Key中
 * @method isInit
 * @return {*}
 */
const isInit = () => {
    const key = Cv.KEY_APP;
    let appData = Store.Storage.get(key);
    if (!appData) appData = {};
    return appData;
};
/**
 * 当前用户的注销行为
 * @method toLogout
 * @return {*}
 */
const toLogout = () => {
    const key = Cv.KEY_USER;
    return Store.Session.remove(key);
};
/**
 * 配合React Router执行登录控制，如果未登录则直接转发到登录界面
 * * reference引用中必须包含$router用于路由转发
 * @method isAuthorized
 * @param {ReactComponent} reference React对应组件引用
 */
const isAuthorized = (reference) => {
    const {$router} = reference.props;
    if (!isLogged()) {
        $router.to(Cv.ENTRY_LOGIN);
    }
};
/**
 * @class Global
 * @description 全局专用业务函数
 */
export default {
    // 是否登录
    isLogged,
    // 是否初始化应用
    isInit,
    // 登陆控制
    isAuthorized,
    // 注销
    toLogout
}
