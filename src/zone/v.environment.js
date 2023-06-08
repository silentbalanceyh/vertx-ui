import Immutable from "immutable";

Object.freeze(process.env);

const ENV = Immutable.fromJS(process.env).toJS();
// eslint-disable-next-line
for (const key in ENV) {
    if (ENV.hasOwnProperty(key)) {
        if (key.startsWith("K_") || key.startsWith("DEV_")) delete ENV[key];// 移除原始K_和DEV_
        // Boolean处理，布尔值;
        if ("true" === ENV[key] || "false" === ENV[key]) {
            ENV[key] = JSON.parse(ENV[key]);
        }
    }
}
const RUNTIME = {
    DEVELOPMENT: "development",
    PRODUCTION: "production"
}
// __解析
const __BOOLEAN = (...keys) => {
    let result = RUNTIME.DEVELOPMENT === process.env.NODE_ENV;
    keys.forEach(key => result = result && process.env[key] && "true" === process.env[key]);
    return Boolean(result);
}
// __BOOLEAN / STRING COMPARE
const __BOOLEAN_EQ = (input) => {
    if ("string" === typeof input) {
        return "true" === input.toString().toLowerCase();
    } else {
        return !!input;
    }
}
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    ...ENV,
    RUNTIME,
    LANGUAGE: ENV['LANGUAGE'],

    DEBUG_DEV: __BOOLEAN("DEV_DEBUG") &&
        RUNTIME.DEVELOPMENT === process.env.NODE_ENV,
    DEBUG: __BOOLEAN("DEV_DEBUG"),                      // DEV_DEBUG
    DEBUG_FORM: __BOOLEAN("DEV_FORM"),                  // DEV_FORM
    DEBUG_AJAX: __BOOLEAN("DEV_MOCK", "DEV_AJAX"),      // DEV_MOCK && DEV_AJAX
    DEBUG_QR: __BOOLEAN("DEV_QR"),                      // DEV_QR

    MONITOR: __BOOLEAN("DEV_DEBUG", "DEV_MONITOR"),     // DEV_MONITOR
    MOCK: __BOOLEAN("DEV_MOCK"),                        // DEV_MOCK
    SIGN: __BOOLEAN_EQ(ENV['SIGN']),

    X_HEADER_SUPPORT: __BOOLEAN_EQ(ENV['X_HEADER_SUPPORT']),

    ENTRY_LOGIN: `/${process.env.ROUTE}${process.env.ENTRY_LOGIN}`,     // 登录页
    ENTRY_ADMIN: `/${process.env.ROUTE}${process.env.ENTRY_ADMIN}`,     // 管理页
    ENTRY_FIRST: `/${process.env.ROUTE}${process.env.ENTRY_FIRST}`,     // 首次登录更改密码
}