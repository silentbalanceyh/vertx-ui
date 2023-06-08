import __APP from './store.fn.is.configuration';
import __Zn from './zero.module.dependency';
import _Logger from './tracer.c.logger';

const __SCHEMA = {
    OAuth: () => {
        const user = __APP.isLogged();
        if (user && user.token) {
            return `Bearer ${user.token}`;
        }
    },
    Basic: () => {
        const user = __APP.isLogged();
        if (user && user.token) {
            return "Basic " + user.token;
        }
    }
};
const token = () => {
    const app = __APP.isInit();
    let auth = "OAuth";
    if (app) {
        auth = app.auth;
        if (!auth) auth = 'OAuth';
    }
    const fnExecute = __SCHEMA[auth];
    return fnExecute();
};


const __parameters = (params = {}) => {
    let param = "";
    const keys = Object.keys(params).sort();
    if (0 < keys.length) {
        keys.forEach(key => {
            if ("pager" === key) {
                // 1.Pager参数专用签名
                let pager = params[key];
                if ("string" === typeof params[key]) {
                    pager = JSON.parse(params[key]);
                }
                if (pager) {
                    let sign = `:index${pager.index}size${pager.size}`;
                    param += key + sign + ":";
                } else {
                    param += key + ":";
                }
            } else {
                // 这两个参数不参加签名
                if ("criteria" !== key && "sig" !== key) {
                    if (params[key]) {
                        if (__Zn.isObject(params[key])) {
                            param += key + __Zn.wayO2S(params[key]) + ":";
                        } else {
                            param += key + params[key] + ":";
                        }
                    } else {
                        // 特殊Boolean值的签名
                        if (false === params[key]) {
                            param += key + "false:";
                        } else if (undefined !== params[key]) {
                            param += key + params[key] + ":";
                        }
                    }
                }
            }
        });
    }
    return param;
};

const __secret = () => {
    const user = __APP.isLogged();
    let secret = "";
    if (user && __Zn.isObject(user)) {
        // 登录后的secret为用户ID
        secret += user.uniqueId;
    } else {
        // 登录前的secret则是时间戳
        secret += __Zn.formatNow("YYYYMMDDHH");
    }
    return secret;
};
const signature = (uri, method = "GET", params = {}) => {
    // 构造签名的method和参数
    let seed = method.toUpperCase();
    seed += ":";
    seed += __parameters(params);
    seed += uri;
    seed += "$";
    // 构造secret
    const secret = __secret();
    // Seed中是否追加用户登录ID
    const user = __APP.isLogged();
    if (user && __Zn.isObject(user)) {
        seed += user.key;
    }
    // 签名
    const sig = __Zn.encryptHmac512(seed, secret);
    _Logger.sign(uri, method, params, {sig, secret, seed});
    params['sig'] = sig;
};
export default {
    token, digitToken: token,
    signature, digitSign: signature,
}