import Immutable from 'immutable';

const $env = Immutable.fromJS(process.env).toJS();
for (const key in $env) {
    if ($env.hasOwnProperty(key)) {
        // 移除原始K_和DEV_
        if (key.startsWith("K_") || key.startsWith("DEV_")) {
            delete $env[key];
        }
    }
}
export default {
    ...$env,
    // 保存用户Session回话的环境变量
    KEY_USER: `${process.env.K_SESSION}SESSION/USER`,
    // 保存应用配置的专用环境变量
    KEY_APP: `${process.env.K_SESSION}SESSION/APP/${process.env.APP.toUpperCase()}`,
    // Redux专用
    KEY_EVENT: process.env.K_EVENT,
    ENTRY_LOGIN: `/${process.env.ROUTE}${process.env.ENTRY_LOGIN}`,
    ENTRY_ADMIN: `/${process.env.ROUTE}${process.env.ENTRY_ADMIN}`,
    DEBUG: Boolean("development" === process.env.NODE_ENV && process.env.DEV_DEBUG),
    MOCK: Boolean("development" === process.env.NODE_ENV && process.env.DEV_MOCK),
    HTTP_METHOD: {
        GET: "get",
        POST: "post",
        PUT: "put",
        DELETE: "delete"
    },
    MIMES: {
        JSON: "application/json"
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
}