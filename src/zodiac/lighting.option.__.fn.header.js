import __Zn from './zero.module.dependency';
import __SEC from './secure.fn.digit.signature';
import _Storage from './store.c.storage';

const Cv = __Zn.Env;

const __headerXSRF = (headers = {}) => {
    // TODO: 执行 xsrfToken 请求
    const xsrfToken = undefined;
    // eslint-disable-next-line
    if (xsrfToken) {
        headers.append(Cv.HTTP11.XSRF_TOKEN, xsrfToken);
    }
}
// 处理Authorization
const __headerSecure = (headers = {}, secure = false) => {
    if (secure) {
        const token = __SEC.digitToken();
        if (token) {
            headers.append(Cv.HTTP11.AUTHORIZATION, token);
        }
    }
}

// RESTful / Sock Shared
const __headerApp = (headers = {}, secure = false) => {
    __headerSecure(headers, secure);
    /* 启用 X_ 的 Header 请求 */
    if (Cv.X_HEADER_SUPPORT) {
        /* X_APP_KEY */
        const appKey = _Storage.getDirect(Cv.X_APP_KEY);
        if (appKey) headers.append(Cv.X_HEADER.X_APP_KEY, appKey);
        /* X_APP_ID */
        const appId = _Storage.getDirect(Cv.X_APP_ID);
        if (appId) headers.append(Cv.X_HEADER.X_APP_ID, appId);
        /* X_SIGMA */
        const sigma = _Storage.getDirect(Cv.X_SIGMA);
        if (sigma) headers.append(Cv.X_HEADER.X_SIGMA, sigma);
        /* X_LANG */
        const language = Cv.LANGUAGE ? Cv.LANGUAGE : Cv.K_VALUE.LANGUAGE;
        if (language) headers.append(Cv.X_HEADER.X_LANG, language);
    }
    /* X_SESSION */
    __headerXSRF(headers);
}

const headerMimeJ = (options = {}, secure = false) => {
    const headers = new Headers();
    __headerApp(headers, secure);
    headers.append(Cv.HTTP11.ACCEPT, Cv.MIMES.JSON);
    if (!options.hasOwnProperty(Cv.HTTP11.CONTENT_TYPE)) {
        headers.append(Cv.HTTP11.CONTENT_TYPE, Cv.MIMES.JSON);
    }
    return headers;
}
const headerMimeB = (options = {}, secure = false) => {
    const headers = new Headers();
    __headerApp(headers, secure);
    headers.append(Cv.HTTP11.ACCEPT, Cv.MIMES.STREAM);
    if (!options.hasOwnProperty(Cv.HTTP11.CONTENT_TYPE)) {
        headers.append(Cv.HTTP11.CONTENT_TYPE, Cv.MIMES.STREAM);
    }
    return headers;
}
const headerMimeS = (options = {}, secure = false) => {
    const headers = new Headers();
    __headerApp(headers, secure);
    return headers;
}

const headerCors = (headerRef, method, inputOpts = {}) => {
    const options = {};
    options.method = method;
    // options support headers replaced
    const {headers = {}, ...inputOptRest} = inputOpts;
    if (headers) {
        Object.keys(headers)
            .forEach(key => headerRef.append(key, headers[key]))
    }
    options.headers = headerRef;
    if (Cv.hasOwnProperty('CORS_MODE')) {
        options.mode = Cv['CORS_MODE'];
    } else {
        options.mode = 'cors';
    }
    if (Cv.hasOwnProperty('CORS_CREDENTIALS')) {
        options.credentials = Cv['CORS_CREDENTIALS'];
    }
    /*
     * 合并传入专用
     */
    if (!__Zn.isEmpty(inputOptRest)) {
        Object.assign(options, inputOptRest);
    }
    return options;
}
export default {
    // 1. 入口 Json -> Header
    headerMimeJ,    // ajaxHeaderJ      application/json
    headerMimeB,    // None             application/octet-stream
    headerMimeS,    // None             websocket needed
    // 2. 修改 Header
    headerCors,     // ajaxOptions
}