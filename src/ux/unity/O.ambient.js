// 导入当前目录
import Store from './O.store';
// 导入外层
import Cv from '../constant';
import E from '../error';
import Value from "../element";
import Abs from '../abyss';

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
 * 路由地址是否发生了变更
 * @param props
 * @param prevProps
 */
const isRoute = (props, prevProps) => {
    const $router = props.$router;
    const $prevRouter = prevProps.$router;
    if ($router && $prevRouter) {
        return $router.path() !== $prevRouter.path();
    } else return false;     // 防止没有调用 Ex.yoAmbient 检查的情况
};
/**
 * 当前用户的注销行为
 * @method toLogout
 * @return {*}
 */
const toLogout = () => {
    /* 注销用户 */
    const key = Cv.KEY_USER;
    const result = Store.Session.remove(key);
    /* 删除 appKey */
    Store.Storage.remove(Cv.X_APP_KEY);
    const app = Store.Session.get(Cv.KEY_APP);
    if (app && app.appKey) {
        delete app.appKey;
        Store.Storage.put(Cv.KEY_APP, app);
    }
    return result;
};
/**
 * 执行路由操作
 * @method toRoute
 * @param reference
 * @param uri
 * @return {*}
 */
const toRoute = (reference = {}, uri = "") => {
    E.fxTerminal(!uri, 10072, uri);
    E.fxTerminal(!reference.hasOwnProperty("props")
        || !reference.props.hasOwnProperty("$router"), 10004, reference);
    const {$router} = reference.props;
    let target;
    if (uri.startsWith(`/${Cv['ROUTE']}`)) {
        target = uri;
    } else {
        target = `/${Cv['ROUTE']}${uri}`;
    }
    target = target.replace(/\/\//g, '/');
    $router.to(target);
};
const toQuery = (name = "") => {
    const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    const r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
};
const toLimit = (props = {}, limits = []) => {
    const inherits = {};
    const $limitKeys = Abs.immutable(limits);
    Object.keys(props).filter(key => !$limitKeys.contains(key))
        .forEach(key => inherits[key] = props[key]);
    return inherits;
};
const toOriginal = (reference = {}) => {
    const original = toQuery("target");
    if (original) {
        const {$router} = reference.props;
        const params = Abs.clone($router.params());
        if (params.key) delete params.key;
        if (params.id) delete params.id;
        if (params.target) delete params.target;
        /*
         * 计算链接
         */
        let calculated = original;
        if (0 <= Object.keys(params).length) {
            calculated += "?";
            Object.keys(params)
                .forEach(paramName => calculated += `${paramName}=${params[paramName]}`);
        }
        toRoute(reference, calculated);
    } else {
        toRoute(reference, Cv.ENTRY_ADMIN);
    }
};
/**
 * 配合React Router执行登录控制，如果未登录则直接转发到登录界面
 * * reference引用中必须包含$router用于路由转发
 * @method isAuthorized
 * @param reference React对应组件引用 React.PureComponent
 */
const isAuthorized = (reference) => {
    const {$router} = reference.props;
    if (0 === Object.keys(isLogged()).length) {
        const path = $router.path();
        if (path) {
            $router.to(Cv.ENTRY_LOGIN + `?target=${path}`);
        } else {
            $router.to(Cv.ENTRY_LOGIN);
        }
    }
};
const toLoading = (consumer, seed = 1) => {
    /*
     * 改成 108 ms，即108毫秒
     */
    const ms = Value.valueInt(Cv['LOADING'], 108);
    setTimeout(consumer, ms * seed);
};
export default {
    // 是否登录
    isLogged,
    // 是否初始化应用
    isInit,
    // 登录控制
    isAuthorized,
    // 路由变更
    isRoute,
    // 注销
    toLogout,
    // 链接地址
    toRoute,
    // 到原来地址
    toOriginal,
    // 统一加载设置加载时间
    toLoading,
    // 读取 Query String
    toQuery,
    // 限制继承
    toLimit,
};
