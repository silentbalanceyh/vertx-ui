import Dg from "./Ux.Debug";
import Cv from './Ux.Constant';

const put = (reference) => (key, value) => {
    Dg.ensureRuntime(reference);
    if (value && key) {
        if (Object.prototype.isPrototypeOf(value)) {
            value = JSON.stringify(value);
        }
        reference.setItem(key, value);
    }
};

const get = (reference) => (key) => {
    Dg.ensureRuntime(reference);
    if (key) {
        let value = reference.getItem(key);
        try {
            value = JSON.parse(value);
        } catch (error) {
            console.error(error);
        }
        return value;
    }
};

const remove = (reference) => (key) => {
    Dg.ensureRuntime(reference);
    if (key) {
        reference.removeItem(key);
    }
};

const clear = (reference) => () => {
    Dg.ensureRuntime(reference);
    reference.clear();
};
/**
 * 存储应用程序配置
 * @method storeApp
 * @param data
 */
const storeApp = (data) => {
    if (data) {
        const key = Cv.KEY_APP;
        put(window.localStorage)(key, data);
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
        put(window.sessionStorage)(key, data);
    }
    return data;
};
/**
 * @class Store
 * @description 访问Session/Local的Storage专用
 */
export default {
    Session: {
        /**
         * SessionStorage存储数据
         * @method Session.put
         * @param {String} key 存储键名
         * @param value 存储的键值
         */
        put: put(window.sessionStorage),
        /**
         * SessionStorage读取数据
         * @method Session.get
         * @param {String} key 读取键名
         */
        get: get(window.sessionStorage),
        /**
         * SessionStorage移除数据
         * @method Session.remove
         * @param {String} key 移除键名
         */
        remove: remove(window.sessionStorage),
        /**
         * SessionStorage清除
         * @method Session.clear
         */
        clear: clear(window.sessionStorage)
    },
    Storage: {
        /**
         * LocalStorage存储数据
         * @method Storage.put
         * @param {String} key 存储键名
         * @param value 存储的键值
         */
        put: put(window.localStorage),
        /**
         * LocalStorage读取数据
         * @method Storage.get
         * @param {String} key 读取键名
         */
        get: get(window.localStorage),
        /**
         * LocalStorage移除数据
         * @method Storage.remove
         * @param {String} key 移除键名
         */
        remove: remove(window.localStorage),
        /**
         * LocalStorage清除
         * @method Storage.clear
         */
        clear: clear(window.localStorage)
    },
    storeApp,
    storeUser
}
