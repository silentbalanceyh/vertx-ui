import __Zn from './zero.module.dependency';

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
 * @name zodiac.Storage
 * @class Storage
 */
class Storage {
    /**
     *
     * @param {String} key 将要写入 storage 的键。
     * @param {any} value 将要写入 storage 中的键对应的值。
     */
    static put(key, value) {
        __Zn.compilePutO(window.localStorage)(key, value);
    }

    /**
     *
     * @param {String} key 将要读取 storage 中的键值。
     * @return {any} 返回读取的数据
     */
    static get(key) {
        return __Zn.compileGetO(window.localStorage)(key);
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
        return __Zn.compileGet(window.localStorage)(key);
    }

    /**
     *
     * @param key
     * @param value
     */
    static putDirect(key, value) {
        return __Zn.compilePut(window.localStorage)(key, value);
    }

    /**
     *
     * @param {String} key 将要移除的 storage 中键值。
     */
    static remove(key) {
        return __Zn.compileRemove(window.localStorage)(key);
    }

    /**
     * 清除 localStorage 中的所有数据。
     */
    static clear() {
        return __Zn.compileClear(window.localStorage)();
    }
}

export default Storage;