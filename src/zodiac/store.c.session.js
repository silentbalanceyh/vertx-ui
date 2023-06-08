import __Zn from "zone";

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
 * @name zodiac.Session
 * @class Session
 */
class Session {
    /**
     *
     * @param {String} key 将要写入 session 的键。
     * @param {any} value 将要写入 session 中的键对应的值。
     */
    static put(key, value) {
        __Zn.compilePutO(window.sessionStorage)(key, value);
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
        return __Zn.compileGetO(window.sessionStorage)(key);
    }

    /**
     *
     * @param key
     * @returns {*}
     */
    static getDirect(key) {
        return __Zn.compileGet(window.sessionStorage)(key);
    }

    /**
     *
     * @param key
     * @param value
     */
    static putDirect(key, value) {
        return __Zn.compilePut(window.sessionStorage)(key, value);
    }

    /**
     * @param {any} key 将要移除的 session 中键值。
     */
    static remove(key) {
        return __Zn.compileRemove(window.sessionStorage)(key);
    }

    /**
     * 清除 sessionStorage 中的所有数据。
     */
    static clear() {
        return __Zn.compileClear(window.sessionStorage)();
    }
}

export default Session;