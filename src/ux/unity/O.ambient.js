// 导入当前目录
import Store from './O.store';
// 导入外层
import Cv from '../constant';
import Value from "../element";
import Abs from '../abyss';
import Rt from './O.ambient.route';

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
        if (app && app['appKey']) {
            delete app['appKey'];
            Store.Storage.put(Cv.KEY_APP, app);
        }
    }
    return result;
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
    const original = Rt.toQuery("target");
    if (original) {
        const {$router} = reference.props;
        const params = Abs.clone($router.params());
        if (params.key) delete params.key;
        if (params.id) delete params.id;
        if (params.target) delete params.target;
        Rt.toRoute(reference, original, params);
    } else {
        /*
         * ROUTE：直接管理界面 /main/index 部分
         * 目标页面 = Cv.ENTRY_ADMIN
         */
        const uri = switched ? switched : Cv.ENTRY_ADMIN;
        Rt.toRoute(reference, uri);
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
        /*
         * target执行计算，target为登录过后的目标的页面
         * 1）target执行 Base64 加密
         * 2）target在解析的时候会执行解码过程
         */
        Rt.toRoute(reference, Cv.ENTRY_LOGIN, {target: path});
    } else {
        Rt.toRoute(reference, Cv.ENTRY_LOGIN);
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
     * 改成 1 ms 毫秒级（略微加载效果）
     * 5 倍距离
     */
    const ms = Value.valueInt(Cv['LOADING'], 5);
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
    // 注销
    toLogout,
    // 到原来地址
    toOriginal,
    // 统一加载设置加载时间
    toLoading,
    // 链接地址
    ...Rt,
};
