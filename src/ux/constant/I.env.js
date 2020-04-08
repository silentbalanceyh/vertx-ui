import Immutable from "immutable";
/*
 * 循环引用问题，旧版
 * import Abs from '../abyss';
 */
Object.freeze(process.env);     // 只读
const ENV = Immutable.fromJS(process.env).toJS();

// eslint-disable-next-line
for (const key in ENV) {
    if (ENV.hasOwnProperty(key)) {
        // 移除原始K_和DEV_
        if (key.startsWith("K_") || key.startsWith("DEV_")) {
            delete ENV[key];
        }
        // Boolean处理
        if ("true" === ENV[key] || "false" === ENV[key]) {
            ENV[key] = Boolean(ENV[key]);
        }
    }
}
const KEY_APP = `${process.env.K_SESSION}SESSION/APP/${process.env.APP.toUpperCase()}`;
const _prepare = (...keys) => {
    let result = "development" === process.env.NODE_ENV;
    keys.forEach(key => {
        result = result && process.env[key] && "true" === process.env[key];
    });
    return Boolean(result);
};
export default {
    /**
     * ## 常量
     *
     * ```js
     * import Ux from 'ux';
     *
     * const value = Ux.Env.KEY_APP;
     * ```
     * @constant
     *
     * @memberOf module:_constant
     */
    KEY_APP,        // App专用Key值
    ENV,            // 环境变量
    _prepare,    // 准备开发环境变量
}

