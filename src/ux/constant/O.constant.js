import ECONOMY from './I.economy';
import Env from './I.env';

const {KEY_APP} = Env;
export default {
    /*
     * 系统环境变量
     */
    ...Env.ENV,
    /*
     * X 系列环境变量
     */
    KEY_APP,
    X_APP_ID: `${KEY_APP}/ID`,
    X_APP_KEY: `${KEY_APP}/KEY`,
    X_SIGMA: `${KEY_APP}/SIGMA`,
    X_HEADER: {
        X_APP_KEY: "X-App-Key",
        X_APP_ID: "X-App-Id",
        X_SIGMA: "X-Sigma",
    },
    /*
     * 开发专用环境变量
     */
    DEBUG: Env._prepare("DEV_DEBUG"), // Boolean("development" === process.env.NODE_ENV && "true" === process.env.DEV_DEBUG),
    MOCK: Env._prepare("DEV_MOCK"), // Boolean("development" === process.env.NODE_ENV && "true" === process.env.DEV_MOCK),
    RENDER: Env._prepare("DEV_FORM"),
    DEBUG_AJAX: Env._prepare("DEV_MOCK", "DEV_AJAX"), // Boolean("development" === process.env.NODE_ENV && "true" === process.env.DEV_MOCK),
    MONITOR: Env._prepare("DEV_MONITOR"),
    SIGN: Env._prepare("SIGN"),

    // 保存用户Session回话的环境变量
    KEY_USER: `${process.env.K_SESSION}SESSION/USER`,
    KEY_EVENT: process.env.K_EVENT,
    KEY_POINTER: `${process.env.K_SESSION}SESSION/POINTER`,
    ENTRY_LOGIN: `/${process.env.ROUTE}${process.env.ENTRY_LOGIN}`,
    ENTRY_ADMIN: `/${process.env.ROUTE}${process.env.ENTRY_ADMIN}`,

    /*
     * Economy 专用环境变量
     */
    ...ECONOMY,

    HTTP_METHOD: {
        GET: "get",
        POST: "post",
        PUT: "put",
        DELETE: "delete"
    },
    MIMES: {
        JSON: "application/json",
        MULTIPART: "multipart/form-data",
        FORM: "application/x-www-form-urlencoded",
        STREAM: "application/octet-stream"
    },
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