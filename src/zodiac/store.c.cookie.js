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
 * @name zodiac.Cookie
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

    /**
     *
     * @returns {{}}
     */
    static getAll() {
        return getCookies();
    }
}

export default Cookie;