import __Zn from './zero.module.dependency';
import __P from './lighting.option.__.fn.handle';
import __O from './lighting.option.__.fn.header';
import __R from './lighting.option.__.fn.reply';

const Cv = __Zn.Env;

const ajaxRead = (method = "get", secure = false) => (uri, params = {}, options) => {
    const $params = __Zn.clone(params);
    const api = __P.handleUri(uri, method, params);
    const headers = __O.headerMimeJ(options, secure);
    const request = new Request(api, __O.headerCors(headers, method, options));
    return __R.replyData(request, $params);
};
const ajaxWrite = (method = "post", secure = false) => (uri, params = {}, options = {}) => {
    const $params = __Zn.clone(params);
    const api = `${Cv['ENDPOINT']}${uri}`;
    const headers = __O.headerMimeJ(options, secure);
    const request = new Request(api, {
        ...__O.headerCors(headers, method, options),
        body: __P.handleParam(params, options)
    });
    return __R.replyData(request, $params);
};
const ajaxFull = (method = "post", secure = false) => (uri, params = {}, options = {}) => {
    const $params = __Zn.clone(params);
    const api = __P.handleUri(uri, method, params);
    const headers = __O.headerMimeJ(options, secure);
    const request = new Request(api, {
        ...__O.headerCors(headers, method, options),
        body: __P.handleParam(params, options)
    });
    return __R.replyData(request, $params);
};
const ajaxDown = (method = "get") => (uri, params = {}, options = {}) => {
    const api = __P.handleUri(uri, method, params);
    const headers = __O.headerMimeB(options, true);
    // Download专用
    const requestOpt = __O.headerCors(headers, method, options);
    if (Cv.HTTP_METHOD.POST.toUpperCase() === method.toUpperCase()) {
        requestOpt.body = __Zn.wayJ2S(params);
    }
    const request = new Request(api, requestOpt);
    return __R.replyBlob(request, params);
}
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    ajaxRead,
    ajaxWrite,
    ajaxFull,
    ajaxDown,
}