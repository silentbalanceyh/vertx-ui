import Log from './Ux.Log';
import Env from './Ux.Env';
import Expr from './Ux.Expr';
import Sign from './Ux.Sign';
import Dg from './Ux.Debug';

const ajaxUri = (uri, method = "get", params = {}) => {
    let api = Expr.formatExpr(uri, params);
    // 签名
    Sign.signature(api, method, params);
    // 追加Query
    const query = Expr.formatQuery(uri, params);
    // 最终请求路径
    api = "get" === method || "delete" === method
        ? `${Env.ENDPOINT}${api}${query}` : `${Env.ENDPOINT}${api}`;
    return api;
};

const ajaxHeader = (secure = false) => {
    const headers = new Headers();
    headers.append(Env.HTTP11.ACCEPT, Env.MIMES.JSON);
    headers.append(Env.HTTP11.CONTENT_TYPE, Env.MIMES.JSON);
    // 处理Authorization
    if (secure) {
        const token = Sign.token();
        Dg.ensureToken(token);
        headers.append(Env.HTTP11.AUTHORIZATION, token);
    }
    return headers;
};

const ajaxParams = (params = {}) => {
    if (params.hasOwnProperty('$body')) {
        return JSON.stringify(params.$body);
    } else {
        return JSON.stringify(params);
    }
};

const ajaxResponse = (request) => {
    return fetch(request)
        .then(response => Log.response(null, response, request.method))
        .then(response => {
            if (response.ok) {
                return response.json()
                    .then(body => Promise.resolve(body.data));
            } else {
                return response.json()
                    .then(data => Promise.reject({
                        ...data,
                        status : response.status,
                        statusText : response.statusText
                    }));
            }
        })
        .catch(error => Promise.reject(error));
};

const ajaxRead = (method = "get", secure = false) => (uri, params = {}) => {
    const api = ajaxUri(uri, method, params);
    Log.request(api, method, params);
    const headers = ajaxHeader(secure);
    const request = new Request(api, {
        method, headers
    });
    return ajaxResponse(request);
};

const ajaxFull = (method = "post", secure = false) => (uri, params = {}) => {
    const api = ajaxUri(uri, method, params);
    Log.request(api, method, params);
    const headers = ajaxHeader(secure);
    const request = new Request(api, {
        method, headers, mode : "cors",
        body : ajaxParams(params)
    });
    return ajaxResponse(request);
};

const ajaxWrite = (method = "post", secure = false) => (uri, params = {}) => {
    const api = `${Env.ENDPOINT}${uri}`;
    Log.request(api, method, params);
    const headers = ajaxHeader(secure);
    const request = new Request(api, {
        method, headers, mode : "cors",
        body : ajaxParams(params)
    });
    return ajaxResponse(request);
};

export default {
    // Public Get
    ajaxFetch : (uri, params = {}) => ajaxRead(Env.HTTP_METHOD.GET)(uri, params),
    ajaxPush : (uri, params = {}) => ajaxWrite(Env.HTTP_METHOD.POST)(uri, params),
    // Secure Get
    ajaxGet : (uri, params = {}) => ajaxRead(Env.HTTP_METHOD.GET, true)(uri, params),
    ajaxPost : (uri, params = {}) => ajaxFull(Env.HTTP_METHOD.POST, true)(uri, params),
    ajaxPut : (uri, params = {}) => ajaxFull(Env.HTTP_METHOD.PUT, true)(uri, params),
    ajaxDelete : (uri, params = {}) => ajaxFull(Env.HTTP_METHOD.DELETE, true)(uri, params)
}
