import Abs from '../abyss';
import Cv from '../constant';
import moment from "moment";
import U from "underscore";

import Amt from "./O.ambient";
import Expr from "./O.format";
import Encrypt from "./O.encrypt";
import Develop from '../develop';

const {Logger: Log} = Develop;

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
 * ##「标准」`Ux.token`
 *
 * 返回安全请求中的令牌信息，最终会根据应用模式处理成 Authorization 的计算值。
 *
 * @memberOf module:_primary
 * @return {String} 返回当前用户登录过后的令牌`token`信息。
 */
const token = () => {
    const app = Amt.isInit();
    let auth = "OAuth";
    if (app) {
        auth = app.auth;
        if (!auth) auth = 'OAuth';
    }
    const fnExecute = SCHEMA[auth];
    return fnExecute();
};
/**
 * ##「标准」`Ux.signature`
 *
 * Zero UI中的RESTful 数字签名功能专用函数。
 *
 * @memberOf module:_primary
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

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    // 签名专用函数
    signature,
    // 读取当前用户登录过后的token，如果未登录则会返回undefined
    token,
    /*
     * 返回值在非动态处理时新增 options 的限制性操作
     */
    aclOp: (options = {}, ops) => {
        /*
         * 操作专用 __acl 处理
         */
        if (ops['__acl']) {
            const {__acl = {}} = ops;
            const {access = []} = __acl;
            if (0 < access.length) {
                /*
                 * filter 函数
                 */
                const fnFalse = (options, accessSet, key) => {
                    if (!accessSet.has(key)) {
                        options[key] = false;
                    }
                }
                const accessSet = new Set(access);
                [
                    "search.enabled",
                    "search.advanced",
                    "op.row.edit",
                    "op.row.delete"
                ].forEach(key => fnFalse(options, accessSet, key))
            }
            delete ops['__acl'];
        }
        /*
         * 限制性功能开放
         */
        const parsed = {};
        ops.filter(item => options.hasOwnProperty(item.clientKey))
            .forEach(item => parsed[item.clientKey] = item.text);
        return parsed;
    },
    aclData: ($inited = {}, reference, $edition) => {
        const acl = {};
        /*
         * __acl 字段提取执行最终的
         * $inited 的处理在任何场景下都生效，所以在外层处理
         */
        const {$options = {}, $mode} = reference.props;
        const {__acl = {}} = $inited;
        const {access = [], fields = [], edition = []} = __acl;
        if (Abs.isEmpty(__acl)) {
            /*
             * 不带权限控制
             */
            acl.$inited = $inited;
        } else {
            const accessSet = new Set(access);
            const processed = {};
            fields.forEach(field => {
                if (accessSet.has(field)) {
                    processed[field] = $inited[field];
                } else {
                    processed[field] = Cv.FORBIDDEN;
                }
            })
            acl.$inited = processed;
        }
        if (false === $edition) {
            // 全表单只读，则不需要考虑其他，直接赋值
            acl.$edition = $edition;
        } else {
            /*
             * 1. 编程模式第一优先级
             * 2. 操作模式第二优先级
             * 3. ACL第三优先级
             */
            if (false === $options['op.row.edit']) {
                /*
                 * 操作模式下的控制，如果禁用了编辑
                 * 那么直接表单不可编辑，但需要排除一种情况
                 *
                 */
                if (Cv.FORM_MODE.EDIT === $mode) {
                    acl.$edition = false;
                } else {
                    acl.$edition = {};
                }
            } else {
                /*
                 * ACL第三优先级
                 */
                // 替换相关数据
                if (Abs.isEmpty(__acl)) {
                    /*
                     * 不带权限控制
                     */
                    acl.$edition = {};
                } else {
                    const replaced = {};
                    const editSet = new Set(edition);
                    fields.forEach(field => replaced[field] = editSet.has(field));
                    const original = $edition ? Abs.clone($edition) : {};
                    original.__acl = replaced;  // 执行后
                    original.__aclRaw = __acl;  // 原始
                    acl.$edition = original;
                }
            }
        }
        return acl;
    },
    aclSubmit: (params = {}, reference) => {
        const data = Abs.clone(params);
        const {$edition = {}} = reference.props;
        const {__aclRaw = {}} = $edition;
        Object.keys(data)
            .filter(key => {
                /*
                 * 移除 $button
                 */
                if (key.startsWith("$")) {
                    return true;
                }

                /*
                 * 字符串类型 $button
                 */
                if (Cv.FORBIDDEN === data[key]) {
                    // 移除
                    return true;
                }

                /*
                 * 时间格式移除
                 */
                if (moment.isMoment(data[key])) {
                    const year = data[key].year();
                    return 9999 === year;
                }

                /*
                 * undefined 需要执行计算
                 */
                if (!Abs.isEmpty(__aclRaw)) {
                    /*
                     * 开启了权限控制
                     */
                    const {access = []} = __aclRaw;
                    if (0 < access.length) {
                        const accessSet = new Set(access);
                        if (accessSet.has(key)) {
                            /*
                             * 如果出现在访问列表中，这种情况的 undefined
                             * 设置为 null
                             */
                            if (undefined === data[key]) {
                                data[key] = null;
                            }
                            return false;
                        } else {
                            /*
                             * 没出现在访问列表中
                             * 删除该字段
                             */
                            return true;
                        }
                    } else return false;
                } else return false;
            })
            .forEach(key => delete data[key]);
        return data;
    }
}