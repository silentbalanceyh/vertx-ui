// 导入当前目录
import Store from './O.store';
// 导入外层
import Cv from '../constant';
import E from '../error';
import Value from "../element";
import Abs from '../abyss';

/**
 * ## 特殊函数「Zero」
 *
 * 和 `storeUser` 对应的登录用户数据读取专用方法。
 *
 * 1. 如果已登录，则可以读取用户数据。
 * 2. 如果未登录，则用户数据为空对象。
 *
 * ```js
 * // 读取当前用户登录数据
 * import Ux from 'ux';
 * const user = Ux.isLogged();
 * ```
 *
 * @memberOf module:_app
 * @return {any} 返回登录的用户数据信息，如果未登录返回 `{}`。
 */
const isLogged = () => {
    const key = Cv.KEY_USER;
    let userData = Store.Session.get(key);
    if (!userData) userData = {};
    return userData;
};
/**
 * ## 特殊函数「Zero」
 *
 * 和 `storeApp` 对应的初始化应用数据读取专用方法。
 *
 * ```js
 * // 读取当前应用数据
 * import Ux from 'ux';
 * const app = Ux.isInit();
 * ```
 *
 * @memberOf module:_app
 * @return {any} 返回当前应用程序数据信息，如果没有则返回 `{}`。
 */
const isInit = () => {
    const key = Cv.KEY_APP;
    let appData = Store.Storage.get(key);
    if (!appData) appData = {};
    return appData;
};
/**
 * ## 特殊函数「Zero」
 *
 * 连接 `react-router` 中的路由对象执行判断，判断当前界面是否执行了**路由变化**，如果出现变化则返回 true，如果没出现变化则 false。
 *
 * @memberOf module:_is
 * @param {Props} props React组件当前属性 props。
 * @param {Props} prevProps React组件的前一个属性 props。
 * @return {boolean} 返回是否发生路由变化的检查值。
 */
const isRoute = (props, prevProps) => {
    const $router = props['$router'];
    const $prevRouter = prevProps['$router'];
    if ($router && $prevRouter) {
        return $router.path() !== $prevRouter.path();
    } else return false;     // 防止没有调用 Ex.yoAmbient 检查的情况
};
/**
 * ## 特殊函数「Zero」
 *
 * 登录注销专用函数，配合当前系统中的信息实现用户**注销**功能。
 *
 * @memberOf module:_app
 * @param {Boolean} cleanApp 是否清除应用信息（登录时不清除）
 * @return {any} 返回注销结果。
 */
const toLogout = (cleanApp = true) => {
    /* 注销用户 */
    const key = Cv.KEY_USER;
    const result = Store.Session.remove(key);
    if (cleanApp) {
        /* 删除 appKey */
        Store.Storage.remove(Cv.X_APP_KEY);
        const app = Store.Session.get(Cv.KEY_APP);
        if (app && app.appKey) {
            delete app.appKey;
            Store.Storage.put(Cv.KEY_APP, app);
        }
    }
    return result;
};
/**
 * ## 标准函数
 *
 * 执行 react-router 的路由跳转功能，路由地址中可以包含前缀，也可以不包含前缀。
 *
 * @memberOf module:_to
 * @param {ReactComponent} reference React组件引用。
 * @param {String} uri 跳转路由信息，会追加`CV["ROUTE"]`的前缀执行跳转。
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
    $router.to(target);
};
/**
 * 标准函数
 *
 * 直接读取查询路径中的查询参数，如：`/uri?name=value&name1=value1`。
 *
 * ```js
 * import Ux from 'ux';
 *
 * const value = Ux.toQuery("name");
 * const value1 = Ux.toQuery("name1");
 * // value 的值是 "value";
 * // value1 的值是 "value1";
 *
 * ```
 *
 * @memberOf module:_to
 * @param {String} name 需要读取的查询参数名称。
 * @return {string|null} 返回读取的参数值。
 */
const toQuery = (name = "") => {
    const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    const r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
};
/**
 * ## 标准函数「Zero」
 *
 * 功能和 `valueLimit`相同，同样的执行操作，用于不同的场景。
 *
 * * `valueLimit` 属于标准函数。
 * * `toLimit` 在自定义组件中调用。
 *
 * @memberOf module:_to
 * @param {Props} props React组件的属性值。
 * @param {Array} limits 需要限制的 keys 的值。
 * @return {Object} 返回限制过后的属性值。
 */
const toLimit = (props = {}, limits = []) => {
    const inherits = {};
    const $limitKeys = Abs.immutable(limits);
    Object.keys(props).filter(key => !$limitKeys.contains(key))
        .forEach(key => inherits[key] = props[key]);
    return inherits;
};
/**
 * ## 标准函数
 *
 * 带原始参数`target`的核心路由跳转功能，新参数中不包含`key, id, target`，可以和 `toRoute` 配合使用。
 *
 * * target：该值为原始的路由路径，如果有值则直接跳转，用于登录控制过后返回原始页面专用。
 *
 * @memberOf module:_to
 * @param {ReactComponent} reference React组件引用。
 * @param {String} switched 传入内容替换掉 Cv.ENTRY_ADMIN
 */
const toOriginal = (reference = {}, switched) => {
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
            const paramQueue = [];
            Object.keys(params)
                .forEach(paramName => paramQueue.push(`${paramName}=${params[paramName]}`));
            calculated += paramQueue.join('&');
        }
        toRoute(reference, calculated);
    } else {
        const uri = switched ? switched : Cv.ENTRY_ADMIN;
        toRoute(reference, uri);
    }
};
/**
 * ## 特殊函数「Zero」
 *
 * 登录控制专用跳转方法，如果已登录则不执行任何跳转，如果未登录则跳转到登录界面，并且加上当前页面实现`target`计算。
 *
 * @memberOf module:_app
 * @param {ReactComponent} reference React组件引用。
 */
const isAuthorized = (reference) => {
    if (0 === Object.keys(isLogged()).length) {
        toUnauthorized(reference);
    }
};
const toUnauthorized = (reference) => {
    const {$router} = reference.props;
    const path = $router.path();
    if (path) {
        $router.to(Cv.ENTRY_LOGIN + `?target=${path}`);
    } else {
        $router.to(Cv.ENTRY_LOGIN);
    }
}
/**
 * ## 标准函数
 *
 * 加载效果界面专用的延迟执行方法，主要用于 ajax 和界面效果联通。
 *
 * @memberOf module:_to
 * @param {Function} consumer 执行函数
 * @param {Number} seed 加载的时间单位
 */
const toLoading = (consumer, seed) => {
    /*
     * 改成 10 ms 毫秒级
     */
    const ms = Value.valueInt(Cv['LOADING'], 10);
    const loadingMs = seed ? seed : ms;
    setTimeout(consumer, ms * loadingMs);
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
