import U from 'underscore';
import Amt from './O.ambient';
import Expr from './O.format';
import Encrypt from './O.encrypt';
import E from '../error';
// 开发专用
import Log from '../develop/logger';

const SCHEMA = {
    OAuth: () => {
        const user = Amt.isLogged();
        if (user && user.token) {
            return `Bearer ${user.token}`;
        }
    },
    Basic: () => {
        const user = Amt.isLogged();
        if (user && user.token) {
            return "Basic " + user.token;
        }
    }
};

const _parameters = (params = {}) => {
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
                if ("criterias" !== key && "sig" !== key) {
                    if (params[key]) {
                        if (U.isObject(params[key])) {
                            param += key + JSON.stringify(params[key]) + ":";
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
const _secret = () => {
    const user = Amt.isLogged();
    let secret = "";
    if (user && U.isObject(user)) {
        // 登录后的secret为用户ID
        secret += user.uniqueId;
    } else {
        // 登录前的secret则是时间戳
        secret += Expr.formatNow("YYYYMMDDHH");
    }
    return secret;
};
/**
 * 特殊函数「Zero」
 *
 * 返回安全请求中的令牌信息，最终会根据应用模式处理成 Authorization 的计算值。
 *
 * @memberOf module:_app
 * @return {String} 返回当前用户登录过后的令牌`token`信息。
 */
const token = () => {
    const app = Amt.isInit();
    E.fxTerminal(!app, 10067, app);
    let auth = app.auth;
    if (!auth) auth = 'OAuth';
    const fnExecute = SCHEMA[auth];
    return fnExecute();
};
/**
 * 特殊函数「Zero」
 *
 * Zero UI中的RESTful 数字签名功能专用函数。
 *
 * @memberOf module:_app
 * @param {String} uri 待签名的路径信息。
 * @param {String} method 待签名的方法信息。
 * @param {Object} params 待签名的方法参数。
 */
const signature = (uri, method = "GET", params = {}) => {
    // 构造签名的method和参数
    let seed = method.toUpperCase();
    seed += ":";
    seed += _parameters(params);
    seed += uri;
    seed += "$";
    // 构造secret
    const secret = _secret();
    // Seed中是否追加用户登录ID
    const user = Amt.isLogged();
    if (user && U.isObject(user)) {
        seed += user.key;
    }
    // 签名
    const sig = Encrypt.encryptHmac512(seed, secret);
    Log.sign(uri, method, params, {sig, secret, seed});
    params['sig'] = sig;
};
export default {
    // 签名专用函数
    signature,
    // 读取当前用户登录过后的token，如果未登录则会返回undefined
    token
};
