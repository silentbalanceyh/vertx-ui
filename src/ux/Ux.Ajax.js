import Rx from "rxjs";
import U from "underscore";
import Log from "./Ux.Log";
import Env from "./Ux.Env";
import Expr from "./Ux.Expr";
import Sign from "./Ux.Sign";
import Dg from "./Ux.Debug";

const ajaxUri = (uri, method = "get", params = {}) => {
    let api = Expr.formatExpr(uri, params);
    // 签名
    Sign.signature(api, method, params);
    // 追加Query
    const query = Expr.formatQuery(uri, params);
    // 最终请求路径
    api =
        "get" === method || "delete" === method
            ? `${Env.ENDPOINT}${api}${query}`
            : `${Env.ENDPOINT}${api}`;
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
    if (params.hasOwnProperty("$body")) {
        return JSON.stringify(params.$body);
    } else {
        return JSON.stringify(params);
    }
};

const ajaxResponse = (request, mockData = {}) =>
    mockData.mock
        ? Promise.resolve(mockData.data)
        : fetch(request)
            .then(response => Log.response(null, response, request.method))
            .then(
                response =>
                    response.ok
                        ? response
                            .json()
                            .then(body => Promise.resolve(body.data))
                        : response.json().then(data =>
                            Promise.reject({
                                ...data,
                                status: response.status,
                                statusText: response.statusText
                            })
                        )
            )
            .catch(error => Promise.reject(error));

const ajaxRead = (method = "get", secure = false) => (uri, params = {}, mockData) => {
    const api = ajaxUri(uri, method, params);
    _logAjax(api, method, params, mockData);
    const headers = ajaxHeader(secure);
    const request = new Request(api, {
        method,
        headers
    });
    return ajaxResponse(request, mockData);
};

const ajaxFull = (method = "post", secure = false) => (uri, params = {}, mockData) => {
    const api = ajaxUri(uri, method, params);
    _logAjax(api, method, params, mockData);
    const headers = ajaxHeader(secure);
    const request = new Request(api, {
        method,
        headers,
        mode: "cors",
        body: ajaxParams(params)
    });
    return ajaxResponse(request, mockData);
};

const _logAjax = (api, method, params, mockData) => {
    if (mockData && mockData.mock) {
        Log.mock(params, mockData.data, method + " " + api);
    } else {
        Log.request(api, method, params);
    }
};
const ajaxWrite = (method = "post", secure = false) => (uri, params = {}, mockData) => {
    const api = `${Env.ENDPOINT}${uri}`;
    _logAjax(api, method, params, mockData);
    const headers = ajaxHeader(secure);
    const request = new Request(api, {
        method,
        headers,
        mode: "cors",
        body: ajaxParams(params)
    });
    return ajaxResponse(request, mockData);
};
/**
 * 统一处理Epic，引入Mock环节
 * @param type
 * @param promise
 * @param processor
 * @param mockData
 * @param mockProcessor
 */
const rxEpic = (type, promise, processor = data => data, mockData = {}, mockProcessor) => {
    if (type && U.isFunction(promise)) {
        // 触发Mock条件
        // 1. 打开Mock环境
        // 2. 提供Mock数据
        if (Env.MOCK && mockData.mock) {
            let processed = mockData.data;
            return Rx.Observable.from(type)
                .map(action => action.payload)
                .map(data => Log.mock(data, mockProcessor ? mockProcessor(data, processed) : processed))
                .map(processor)
                .map(data => Env.dataOut(data));
        } else {
            // 非Mock模式
            return Rx.Observable.from(type)
                .map(action => action.payload)
                .map(promise)
                .switchMap(promise =>
                    Rx.Observable.from(promise)
                        .map(processor)
                        .map(data => Env.dataOut(data))
                );
        }
    } else {
        console.error("[ Ajax ] type or promise is invalid.", type, promise);
    }
};
export default {
    rxEpic,
    // Public Get
    ajaxFetch: (uri, params = {}) => ajaxRead(Env.HTTP_METHOD.GET)(uri, params),
    ajaxPush: (uri, params = {}, mockData) =>
        ajaxWrite(Env.HTTP_METHOD.POST)(uri, params, mockData),
    // Secure Get
    ajaxGet: (uri, params = {}, mockData) =>
        ajaxRead(Env.HTTP_METHOD.GET, true)(uri, params, mockData),
    ajaxPost: (uri, params = {}, mockData) =>
        ajaxFull(Env.HTTP_METHOD.POST, true)(uri, params, mockData),
    ajaxPut: (uri, params = {}, mockData) =>
        ajaxFull(Env.HTTP_METHOD.PUT, true)(uri, params, mockData),
    ajaxDelete: (uri, params = {}, mockData) =>
        ajaxFull(Env.HTTP_METHOD.DELETE, true)(uri, params, mockData)
};
