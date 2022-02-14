import Cv from '../constant';
import E from '../error';

const put = (reference) => (key, value) => {
    E.fxTerminal(!reference, 10063, reference);
    if (value && key) {
        if (Object.prototype.isPrototypeOf(value)) {
            try {
                value = JSON.stringify(value);
            } catch (ex) {
                console.error(value);
                console.trace(ex);
            }
        }
        reference.setItem(key, value);
    }
};

const get = (reference) => (key) => {
    E.fxTerminal(!reference, 10063, reference);
    if (key) {
        let value = reference.getItem(key);
        try {
            value = JSON.parse(value);
        } catch (error) {
            E.fxTerminal(true, 10037, error, key);
        }
        return value;
    }
};

const getDirect = (reference) => (key) => {
    E.fxTerminal(!reference, 10063, reference);
    if (key) {
        return reference.getItem(key);
    }
};

const remove = (reference) => (key) => {
    E.fxTerminal(!reference, 10063, reference);
    if (key) {
        reference.removeItem(key);
    }
};

const clear = (reference) => () => {
    E.fxTerminal(!reference, 10063, reference);
    reference.clear();
};
/**
 * ## 「引擎」`Ux.storeApp`
 *
 * 首页一般会读取相关的应用数据，然后将应用存储到 localStorage 中，存储的数值包括：
 *
 * * App本身数据的存储。
 * * `X-App-Id`的存储。
 * * `X-Sigma`的存储。
 * * 如果开启了 isKey = true，则存储`X-App-Key`。
 *
 * @memberOf module:_engine
 * @param {Object} data 传入的应用数据。
 * @param {boolean} isKey 是否存储 appKey。
 * @return {any} 返回应用数据。
 */
const storeApp = (data, isKey = false) => {
    if (data) {
        const fnPut = put(window['localStorage']);
        fnPut(Cv.KEY_APP, data);

        fnPut(Cv.X_APP_ID, data.key);
        fnPut(Cv.X_SIGMA, data.sigma);

        if (isKey && data.appKey) {
            fnPut(Cv.X_APP_KEY, data.appKey);
        }
    }
    return data;
};
/**
 * ## 「引擎」`Ux.storeUser`
 *
 * 登录过后存储用户的专用方法，存储当前用户数据到 sessionStorage 中。
 *
 * @memberOf module:_engine
 * @param {Object} data 被存储的用户数据。
 * @return {any} 返回存储好的数据。
 */
const storeUser = (data) => {
    if (data) {
        const key = Cv.KEY_USER;
        put(window['sessionStorage'])(key, data);
    }
    return data;
};

const getCookies = () => {
    const cookieStr = document.cookie.split(";");
    const cookie = {};
    cookieStr.forEach(kv => {
        const key = kv.toString().split("=")[0];
        const value = kv.toString().split("=")[1];
        if (key && value) {
            cookie[key] = value;
        }
    });
    return cookie;
};

const getCookie = (key = "") => {
    const cookie = getCookies();
    if (cookie.hasOwnProperty(key)) {
        return cookie[key];
    } else {
        return undefined;
    }
};

/**
 * ## Cookie 类
 *
 * 客户端专用 Cookie 类，调用如下：
 *
 * ```js
 * // 非法调用
 * const cookie = new Cookie();
 *
 * // 合法调用
 * import Ux from 'ux';
 * const value = Ux.Cookie.get("testKey");
 * ```
 *
 * @class Cookie
 */
class Cookie {
    /**
     *
     * @param {String} key 将要读取 cookie 中的键值。
     * @return {any} 返回读取的数据
     */
    static get(key) {
        return getCookie(key)
    }
}

/**
 * ## Session 类
 *
 * 客户端会话 Session 类，调用如下：
 *
 * ```js
 * // 非法调用
 * const session = new Session();
 *
 * // 合法调用
 * import Ux from 'ux';
 * const value = Ux.Session.get("testKey");
 * ```
 *
 * @class Session
 */
class Session {
    /**
     *
     * @param {String} key 将要写入 session 的键。
     * @param {any} value 将要写入 session 中的键对应的值。
     */
    static put(key, value) {
        put(window.sessionStorage)(key, value);
    }

    /**
     * 代码例子：
     *
     * ```js
     * const isLogged = () => {
     *     const key = Cv.KEY_USER;
     *     let userData = Store.Session.get(key);
     *     if (!userData) userData = {};
     *     return userData;
     * };
     * ```
     *
     * @param {String} key 将要读取 session 中的键值。
     * @return {any} 返回读取的数据
     */
    static get(key) {
        return get(window.sessionStorage)(key);
    }

    static getDirect(key) {
        return getDirect(window.sessionStorage)(key);
    }

    /**
     *
     * @param {String} key 将要移除的 session 中键值。
     */
    static remove(key) {
        remove(window.sessionStorage)(key);
    }

    /**
     * 清除 sessionStorage 中的所有数据。
     */
    static clear() {
        clear(window.sessionStorage)();
    }
}

/**
 * ## Storage 类
 *
 * 存储专用雷，处理 localStorage，调用如下：
 *
 * ```js
 * // 非法调用
 * const storage = new Storage();
 *
 * // 合法调用
 * import Ux from 'ux';
 * const value = Ux.Storage.get("testKey");
 * ```
 *
 * @class Storage
 */
class Storage {
    /**
     *
     * @param {String} key 将要写入 storage 的键。
     * @param {any} value 将要写入 storage 中的键对应的值。
     */
    static put(key, value) {
        put(window.localStorage)(key, value);
    }

    /**
     *
     * @param {String} key 将要读取 storage 中的键值。
     * @return {any} 返回读取的数据
     */
    static get(key) {
        return get(window.localStorage)(key);
    }

    /**
     *
     * 内部调用代码例子
     *
     * ```js
     * const appKey = Ut.Storage.getDirect(Cv.X_APP_KEY);
     * if (appKey) headers.append(Cv.X_HEADER.X_APP_KEY, appKey);
     *
     * const appId = Ut.Storage.getDirect(Cv.X_APP_ID);
     * if (appId) headers.append(Cv.X_HEADER.X_APP_ID, appId);
     *
     * const sigma = Ut.Storage.getDirect(Cv.X_SIGMA);
     * if (sigma) headers.append(Cv.X_HEADER.X_SIGMA, sigma);
     * ```
     *
     * @param {String} key 将要读取 storage 中的键值。
     * @return {any} 返回的直接数据
     */
    static getDirect(key) {
        return getDirect(window.localStorage)(key);
    }

    /**
     *
     * @param {String} key 将要移除的 storage 中键值。
     */
    static remove(key) {
        remove(window.localStorage)(key);
    }

    /**
     * 清除 localStorage 中的所有数据。
     */
    static clear() {
        clear(window.localStorage)();
    }
}

export default {
    Cookie,
    Session,
    Storage,
    storeApp,
    storeUser
};
