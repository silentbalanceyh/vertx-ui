import Cv from '../cv/Ux.Constant';
import E from '../Ux.Error';

const put = (reference) => (key, value) => {
    E.fxTerminal(!reference, 10063, reference);
    if (value && key) {
        if (Object.prototype.isPrototypeOf(value)) {
            value = JSON.stringify(value);
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
            E.fxTerminal(true, 10037, error);
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
 * 存储应用程序配置
 * @method storeApp
 * @param data
 * @param appKey
 */
const storeApp = (data, appKey = false) => {
    if (data) {
        const fnPut = put(window['localStorage']);
        fnPut(Cv.KEY_APP, data);
        {
            fnPut(Cv.X_APP_ID, data.key);
            fnPut(Cv.X_SIGMA, data.sigma);
        }
        if (appKey && data.appKey) {
            fnPut(Cv.X_APP_KEY, data.appKey);
        }
    }
    // Fluent for Rxjs
    return data;
};
/**
 * 存储用户数据
 * @method storeUser
 * @param data
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
 * @class Store
 * @description 访问Session/Local的Storage专用
 */
export default {
    Cookie: {
        get: getCookie
    },
    Session: {
        /**
         * SessionStorage存储数据
         * @method Session.put
         * @param {String} key 存储键名
         * @param value 存储的键值
         */
        put: put(window['sessionStorage']),
        /**
         * SessionStorage读取数据
         * @method Session.get
         * @param {String} key 读取键名
         */
        get: get(window['sessionStorage']),
        /**
         * SessionStorage移除数据
         * @method Session.remove
         * @param {String} key 移除键名
         */
        remove: remove(window['sessionStorage']),
        /**
         * SessionStorage清除
         * @method Session.clear
         */
        clear: clear(window['sessionStorage'])
    },
    Storage: {
        /**
         * LocalStorage存储数据
         * @method Storage.put
         * @param {String} key 存储键名
         * @param value 存储的键值
         */
        put: put(window['localStorage']),
        /**
         * LocalStorage读取数据
         * @method Storage.get
         * @param {String} key 读取键名
         */
        get: get(window['localStorage']),
        getDirect: getDirect(window['localStorage']),
        /**
         * LocalStorage移除数据
         * @method Storage.remove
         * @param {String} key 移除键名
         */
        remove: remove(window['localStorage']),
        /**
         * LocalStorage清除
         * @method Storage.clear
         */
        clear: clear(window['localStorage'])
    },
    storeApp,
    storeUser
};
