import Global from './Ux.Global';
import Expr from './Ux.Expr';
import Encrypt from './Ux.Encrypt';
import Log from './Ux.Log';
import Dg from './Ux.Debug';

const SCHEMA = {
    OAuth: () => {
        const user = Global.isLogged();
        if (user && user.token) {
            return `Bearer ${user.token}`;
        }
    },
    Basic: () => {
        const user = Global.isLogged();
        if (user && user.token) {
            return "Basic " + user.token
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
                        if ("object" === typeof params[key]) {
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
    const user = Global.isLogged();
    let secret = "";
    if (user && "object" === typeof user) {
        // 登录后的secret为用户ID
        secret += user.uniqueId;
    } else {
        // 登录前的secret则是时间戳
        secret += Expr.formatNow("YYYYMMDDHH");
    }
    return secret;
};
/**
 * 读取Token信息
 * @method token
 * @return {*}
 */
const token = () => {
    const app = Global.isInit();
    Dg.ensureApp(app);
    let auth = app.auth;
    if (!auth) auth = 'OAuth';
    const fnExecute = SCHEMA[auth];
    return fnExecute();
};
/**
 * 数字签名函数
 * @method signature
 * @param {String} uri Ajax访问专用Uri
 * @param method Http方法
 * @param params Http参数
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
    const user = Global.isLogged();
    if (user && "object" === typeof user) {
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
}
