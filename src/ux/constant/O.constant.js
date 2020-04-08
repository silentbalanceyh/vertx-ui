import ECONOMY from './I.economy';
import Env from './I.env';

const {KEY_APP} = Env;

export default {
    /**
     * ## 常量
     *
     * ```js
     * import Ux from 'ux';
     * const value = Ux.Env.xxx;
     * ```
     *
     * 该常量主要用于环境变量，会包含所有环境变量的基本信息，环境变量基本规则
     *
     * 1. 去掉前缀 `Z_` 的环境变量名称
     * 2. 去掉前缀 `DEV_` 的环境变量名称
     *
     * @memberOf module:_constant
     * @constant ENV
     */
    ...Env.ENV,
    /*
     * ## 常量
     *
     * ```json
     * import Ux from 'ux';
     * const value = Ux.Env.KEY_APP;
     * ```
     *
     * 多应用环境的当前应用的主键信息，对应后端 `X_APP` 表中的主键数据。
     *
     * @memberOf module:_constant
     */
    KEY_APP,
    /**
     * ## 常量
     *
     * ```json
     * import Ux from 'ux';
     * const value = Ux.Env.X_APP_ID;
     * ```
     *
     * LocalStorage 专用的存储键值（非敏感信息存储）
     *
     * @memberOf module:_constant
     */
    X_APP_ID: `${KEY_APP}/ID`,
    /**
     * ## 常量
     *
     * ```json
     * import Ux from 'ux';
     * const value = Ux.Env.X_APP_KEY;
     * ```
     *
     * LocalStorage 专用的存储键值（敏感信息存储）
     *
     * @memberOf module:_constant
     */
    X_APP_KEY: `${KEY_APP}/KEY`,
    /**
     * ## 常量
     *
     * ```json
     * import Ux from 'ux';
     * const value = Ux.Env.X_SIGMA;
     * ```
     *
     * LocalStorage 专用的存储键值（统一标识专用）
     *
     * @memberOf module:_constant
     */
    X_SIGMA: `${KEY_APP}/SIGMA`,
    /**
     * ## 常量
     *
     * ```json
     * import Ux from 'ux';
     * const value = Ux.Env.X_HEADER;
     * ```
     *
     * X 系列的头部专用信息，用于处理 X 系列的核心头部信息，主要包含：
     *
     * * `X_APP_KEY`：敏感信息多应用键值。
     * * `X_APP_ID`：非敏感信息的通用多应用键值。
     * * `X_SIGMA`：统一标识符。
     * * `X_LANG`：多语言环境专用头信息
     *
     *
     * @memberOf module:_constant
     */
    X_HEADER: {
        X_APP_KEY: "X-App-Key",
        X_APP_ID: "X-App-Id",
        X_SIGMA: "X-Sigma",
        X_LANG: "X-Lang"
    },
    /**
     * ## 常量
     *
     * 是否开启 debug 调试环境，`"development" === process.env.NODE_ENV` 时生效。
     *
     *
     * @memberOf module:_constant
     **/
    DEBUG: Env._prepare("DEV_DEBUG"), // Boolean("development" === process.env.NODE_ENV && "true" === process.env.DEV_DEBUG),
    /**
     * ## 常量
     *
     * 是否开启 mock 模拟数据环境，`"development" === process.env.NODE_ENV` 时生效。
     *
     * @memberOf module:_constant
     */
    MOCK: Env._prepare("DEV_MOCK"), // Boolean("development" === process.env.NODE_ENV && "true" === process.env.DEV_MOCK),
    /**
     * ## 常量
     *
     * 是否开启 form 表单调试环境，`"development" === process.env.NODE_ENV` 时生效。
     *
     * @memberOf module:_constant
     */
    DEBUG_FORM: Env._prepare("DEV_FORM"),
    /**
     * ## 常量
     *
     * 是否开启 ajax 请求响应模拟调试环境，`"development" === process.env.NODE_ENV` 时生效。
     *
     * @memberOf module:_constant
     */
    DEBUG_AJAX: Env._prepare("DEV_MOCK", "DEV_AJAX"), // Boolean("development" === process.env.NODE_ENV && "true" === process.env.DEV_MOCK),
    /**
     * ## 常量
     *
     * 是否开启前端界面监控环境工具，`"development" === process.env.NODE_ENV` 时生效。
     *
     * @memberOf module:_constant
     */
    MONITOR: Env._prepare("DEV_MONITOR"),
    /**
     * ## 常量
     *
     * 是否开启 RESTful 的数字签名功能，`"development" === process.env.NODE_ENV` 时生效。
     *
     * @memberOf module:_constant
     */
    SIGN: Env._prepare("SIGN"),
    /**
     * ## 常量
     *
     * SessionStorage 专用的存储键值，存储当前用户登录回话信息
     *
     * @memberOf module:_constant
     */
    KEY_USER: `${process.env.K_SESSION}SESSION/USER`,
    /**
     * ## 常量
     *
     * SessionStorage 专用的存储键值，存储 Redux 的事件专用信息
     *
     * @memberOf module:_constant
     */
    KEY_EVENT: process.env.K_EVENT,
    /**
     * ## 常量
     *
     * SessionStorage 专用的存储键值，存储反向指针的回话信息专用
     *
     * @memberOf module:_constant
     */
    KEY_POINTER: `${process.env.K_SESSION}SESSION/POINTER`,

    /**
     * ## 常量
     *
     * 当前站点的登录入口模板，根据环境变量计算
     *
     * @memberOf module:_constant
     */
    ENTRY_LOGIN: `/${process.env.ROUTE}${process.env.ENTRY_LOGIN}`,

    /**
     * ## 常量
     *
     * 当前站点的管理界面主页模板，根据环境变量计算
     *
     * @memberOf module:_constant
     */
    ENTRY_ADMIN: `/${process.env.ROUTE}${process.env.ENTRY_ADMIN}`,

    /*
     * Economy 专用环境变量
     */
    ...ECONOMY,
    /**
     * ## 常量
     *
     * HTTP方法常量，目前支持：`GET, POST, PUT, DELETE`四种。
     *
     * @memberOf module:_constant
     */
    HTTP_METHOD: {
        GET: "get",
        POST: "post",
        PUT: "put",
        DELETE: "delete"
    },
    /**
     * ## 常量
     *
     * 常用的四种 MIME 类型，后期可扩展
     *
     * @memberOf module:_constant
     */
    MIMES: {
        JSON: "application/json",
        MULTIPART: "multipart/form-data",
        FORM: "application/x-www-form-urlencoded",
        STREAM: "application/octet-stream"
    },
    /**
     * ## 常量
     *
     * HTTP11 中的请求头所有标准协议信息
     *
     * @memberOf module:_constant
     */
    HTTP11: {
        "ACCEPT": "Accept",
        "ACCEPT_CHARSET": "Accept-Charset",
        "ACCEPT_ENCODING": "Accept-Encoding",
        "ACCEPT_LANGUAGE": "Accept-Language",
        "ACCEPT_RANGES": "Accept-Ranges",
        "AGE": "Age",
        "ALLOW": "Allow",
        "AUTHORIZATION": "Authorization",
        "CACHE_CONTROL": "Cache-Control",
        "CONNECTION": "Connection",
        "CONTENT_BASE": "Content-Base",
        "CONTENT_ENCODING": "Content-Encoding",
        "CONTENT_LENGTH": "Content-Length",
        "CONTENT_LOCATION": "Content-Location",
        "CONTENT_MD5": "Content-MD5",
        "CONTENT_RANGE": "Content-Range",
        "CONTENT_TYPE": "Content-Type",
        "DATE": "Date",
        "ETAG": "ETag",
        "EXPIRES": "Expires",
        "FORM": "Form",
        "HOST": "Host",
        "IF_MODIFIED_SINCE": "If-Modified-Since",
        "IF_MATCH": "If-Match",
        "IF_NONE_MATCH": "If-None-Match",
        "IF_RANGE": "If-Range",
        "IF_UNMODIFIED_SINCE": "If-Unmodified-Since",
        "LAST_MODIFIED": "Last-Modified",
        "LOCATION": "Location",
        "MAX_FORWARDS": "Max-Forwards",
        "PRAGMA": "Pragma",
        "PROXY_AUTHENTICATE": "Proxy-Authenticate",
        "PROXY_AUTHORIZATION": "Proxy-Authorization",
        "PUBLIC": "Public",
        "RANGE": "Range",
        "REFENER": "Refener",
        "RETRY_AFTER": "Retry-After",
        "SERVER": "Server",
        "TRANSFER_ENCODING": "Transfer-Encoding",
        "UPGRADE": "Upgrade",
        "USER_AGENT": "User-Agent",
        "VARY": "Vary",
        "WARNING": "Warning",
        "WWW_AUTHENTICATE": "WWW-Authenticate",
        "XSRF_TOKEN": "X-XSRF-TOKEN"
    },
};