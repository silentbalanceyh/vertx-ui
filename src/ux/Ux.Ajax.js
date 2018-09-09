import Log from "./monitor/Mt.Logger";
import Cv from "./Ux.Constant";
import Expr from "./util/Ux.Expr";
import Sign from "./util/Ux.Sign";
import Immutable from 'immutable'
import E from './Ux.Error';
import Dg from './Ux.Debug';
import RxAjax from './Ux.Ajax.Rx';
import Type from './Ux.Type';
import U from 'underscore';

/**
 * Ajax远程访问过程中的Uri处理器
 * @method ajaxUri
 * @private
 * @param {String} uri 传入的原始路径，如：/api/app/:name
 * @param {String} method 传入的HTTP方法，默认为get
 * @param {Object} params 当前请求的参数数据
 * @return {String}
 */
const ajaxUri = (uri, method = "get", params = {}) => {
    let api = Expr.formatExpr(uri, params);
    // 签名
    if (Cv.SIGN) {
        Sign.signature(api, method, params);
    }
    // 追加Query
    const query = Expr.formatQuery(uri, params);
    // 最终请求路径
    api = "get" === method || "delete" === method ?
        `${Cv['ENDPOINT']}${api}${query}` :
        `${Cv['ENDPOINT']}${api}`;
    return api;
};
/**
 * XSRF请求专用，从cookie中读取XSRF的Token
 * @method ajaxXSRF
 * @private
 * @param headers
 */
const ajaxXSRF = (headers = {}) => {
    const xsrfToken = undefined;
    if (xsrfToken) {
        headers.append(Cv.HTTP11.XSRF_TOKEN, xsrfToken)
    }
};
/**
 * Ajax远程访问过程中的Header处理器
 * @method ajaxHeader
 * @private
 * @param {Boolean} secure 是否为安全模式？安全模式会添加Authorization头。
 * @return {Headers}
 */
const ajaxHeader = (secure = false) => {
    const headers = new Headers();
    headers.append(Cv.HTTP11.ACCEPT, Cv.MIMES.JSON);
    headers.append(Cv.HTTP11.CONTENT_TYPE, Cv.MIMES.JSON);
    // 处理Authorization
    if (secure) {
        const token = Sign.token();
        E.fxTerminal(!token, 10065, token);
        headers.append(Cv.HTTP11.AUTHORIZATION, token);
    }
    ajaxXSRF(headers);
    return headers;
};
/**
 * Ajax中的特殊参数处理器，如果包含了$body字段值，则将该值当做可处理的参数处理，
 * 该方法参数主要用于处理带路径参数的POST/PUT方法同时使用的场景
 * @method ajaxParams
 * @private
 * @param {Object} params
 * @return {String}
 * @example
 *
 *      // PUT和POST的处理
 *      Ux.ajaxPost("/api/and/tabulars/sigma/:sigma", {
 *          sigma : hotel.sigma,
 *          $body : [
 *              "room.clean.status",
 *              "room.status",
 *              "room.op.status"
 *          ]
 *      }),
 */
const ajaxParams = (params = {}) => {
    const language = Cv['LANGUAGE'] ? Cv['LANGUAGE'] : "cn";
    const itLang = (data) => Type.itObject(data, (field, value) => {
        if (U.isArray(value)) {
            data[field].forEach(item => itLang(item))
        } else {
            if (U.isObject(data)) {
                data.language = language;
            }
        }
    });
    if (params.hasOwnProperty("$body")) {
        itLang(params.$body);
        return JSON.stringify(params.$body);
    } else {
        itLang(params);
        return JSON.stringify(params);
    }
};
/**
 *
 * @param body
 */
const ajaxAdapter = (body = {}) => {
    return body.data ? body.data : body;
};
/**
 * Ajax中的响应处理器，Promise调用返回过后的响应专用处理器
 * @method ajaxResponse
 * @private
 * @param {Request} request 请求对象
 * @param {Object} mockData 【Mock环境可用】专用Mock响应处理
 * @param {Object} params
 * @return {Promise<Response>}
 */
const ajaxResponse = async (request, mockData = {}, params) => {
    if (Cv.MOCK && mockData.mock) {
        return Promise.resolve(mockData.processor ? mockData.processor(mockData.data, params) : mockData.data);
    } else {
        const response = await fetch(request);
        let body = await response.json();
        // 任何时候都需要调用适配器，包括errors
        body = ajaxAdapter(body);
        if (!response.ok) {
            body = {
                ...body,
                status: response.status,
                statusText: response.statusText
            };
        }
        if (Cv["DEBUG_AJAX"]) Dg.dgFileJson({
            request: params,
            response: body
        });
        Log.response(body, params, request);
        if (response.ok) {
            return body;
        } else {
            console.error(body);
            return Promise.reject({data: body});
        }
    }
};
/**
 * 【高阶函数：二阶】Ajax统一调用的读取方法，生成统一的Ajax远程读取方法
 * @method ajaxRead
 * @private
 * @param method HTTP方法
 * @param secure 是否安全模式
 */
const ajaxRead = (method = "get", secure = false) => (uri, params = {}, mockData) => {
    const $params = Immutable.fromJS(params).toJS();
    const api = ajaxUri(uri, method, params);
    _logAjax(api, method, params, mockData);
    const headers = ajaxHeader(secure);
    const request = new Request(api, _ajaxOptions(method, headers));
    return ajaxResponse(request, mockData, $params);
};

const ajaxResource = (uri) => {
    const request = new Request(uri, {
        method: "get"
    });
    return fetch(request).then(data => Promise.resolve(data.text()))
};
/**
 * 【高阶函数：二阶】Ajax统一调用的读写双用方法，生成统一的Ajax远程调用方法，ajaxRead + ajaxWrite方法
 * @method ajaxFull
 * @private
 * @param method HTTP方法
 * @param secure 是否安全模式
 */
const ajaxFull = (method = "post", secure = false) => (uri, params = {}, mockData) => {
    const $params = Immutable.fromJS(params).toJS();
    const api = ajaxUri(uri, method, params);
    _logAjax(api, method, params, mockData);
    const headers = ajaxHeader(secure);
    const request = new Request(api, {
        ..._ajaxOptions(method, headers),
        body: ajaxParams(params)
    });
    return ajaxResponse(request, mockData, $params);
};
/**
 * Ajax日志函数，打印请求过程中的日志信息
 * @method _logAjax
 * @private
 * @param api 当前Ajax请求的Uri路径
 * @param method 当前Ajax使用的HTTP方法
 * @param params 当前Ajax请求的参数信息
 * @param mockData 【Mock环境可用】当前Ajax请求的Mock数据
 */
const _logAjax = (api, method, params, mockData = {}) => {
    if ((mockData && mockData.mock) || mockData['forceMock']) {
        Log.mock(params, mockData.data, method + " " + api);
    } else {
        Log.request(api, method, params, Sign.token());
    }
};

const _ajaxOptions = (method, headers) => {
    const options = {};
    options.method = method;
    options.headers = headers;
    if (Cv.hasOwnProperty('CORS_MODE')) {
        options.mode = Cv['CORS_MODE'];
    } else {
        options.mode = 'cors';
    }
    if (Cv.hasOwnProperty('CORS_CREDENTIALS')) {
        options.credentials = Cv['CORS_CREDENTIALS'];
    }
    return options;
};
/**
 * 【高阶函数：二阶】Ajax统一调用的读取方法，生成统一的Ajax远程写数据方法
 * @method ajaxWrite
 * @private
 * @param method HTTP方法
 * @param secure 是否安全模式
 */
const ajaxWrite = (method = "post", secure = false) => (uri, params = {}, mockData) => {
    const $params = Immutable.fromJS(params).toJS();
    const api = `${Cv['ENDPOINT']}${uri}`;
    _logAjax(api, method, params, mockData);
    const headers = ajaxHeader(secure);
    const request = new Request(api, {
        ..._ajaxOptions(method, headers),
        body: ajaxParams(params)
    });
    return ajaxResponse(request, mockData, $params);
};
/**
 * 构造微服务路径专用
 * @param serviceName 服务名称
 * @param uri 服务专用URI
 */
const _buildApi = (serviceName = "", uri = "") => `/${serviceName}${uri}`.replace(/\/\//g, "/");

const ajaxUniform = (success, failure, loading) => new Promise((resolve, reject) => {
    if (U.isFunction(success)) {
        // 1.执行success函数
        const retSuccess = success();
        // 2.是否Promise
        if (Promise.prototype.isPrototypeOf(retSuccess)) {
            return success.then(data => {
                loading();
                return resolve({
                    data, success: true
                });
            }).catch(errors => {
                loading();
                if (U.isFunction(failure)) {
                    // 执行failure专用
                    const retFailure = failure(errors);
                    if (Promise.prototype.isPrototypeOf(retFailure)) {
                        return retFailure;
                    } else {
                        return reject(retFailure);
                    }
                } else {
                    return reject(errors);
                }
            })
        } else {
            // 不返回promise，直接返回值
            loading();
            return resolve({
                data: retSuccess,
                success: true
            })
        }
    } else {
        return resolve({success: true});
    }
});
/**
 * @class Ajax
 * @description 远程Ajax访问专用API方法
 */
export default {
    ...RxAjax,
    // 特殊方法，传入两个参数返回Promise
    ajaxUniform,
    // 特殊方法读取当前想对路径
    ajaxResource,
    /**
     * secure = false，非安全模式的读取方法，HttpMethod = GET，底层调ajaxRead
     * @method ajaxFetch
     * @param uri 该Ajax调用的Uri路径
     * @param params 请求参数
     * @param mockData 【Mock环境可用】模拟数据
     */
    ajaxFetch: (uri, params = {}, mockData) =>
        ajaxRead(Cv.HTTP_METHOD.GET)(uri, params, mockData),
    microFetch: (service, uri, params = {}, mockData) =>
        ajaxRead(Cv.HTTP_METHOD.GET)(_buildApi(service, uri), params, mockData),
    /**
     * secure = false，非安全模式的写方法，HttpMethod = POST，底层调ajaxWrite
     * @method ajaxPush
     * @param uri 该Ajax调用的Uri路径
     * @param params 请求参数
     * @param mockData 【Mock环境可用】模拟数据
     */
    ajaxPush: (uri, params = {}, mockData) =>
        ajaxWrite(Cv.HTTP_METHOD.POST)(uri, params, mockData),
    microPush: (service, uri, params, mockData) =>
        ajaxWrite(Cv.HTTP_METHOD.POST)(_buildApi(service, uri), params, mockData),
    /**
     * secure = true，安全模式的读取方法，HttpMethod = GET，底层调ajaxRead
     * @method ajaxGet
     * @param uri 该Ajax调用的Uri路径
     * @param params 请求参数
     * @param mockData 【Mock环境可用】模拟数据
     */
    ajaxGet: (uri, params = {}, mockData) =>
        ajaxRead(Cv.HTTP_METHOD.GET, true)(uri, params, mockData),
    microGet: (service, uri, params, mockData) =>
        ajaxRead(Cv.HTTP_METHOD.GET, true)(_buildApi(service, uri), params, mockData),
    /**
     * secure = true，安全模式的写方法，HttpMethod = POST，底层调ajaxFull
     * @method ajaxPost
     * @param uri 该Ajax调用的Uri路径
     * @param params 请求参数
     * @param mockData 【Mock环境可用】模拟数据
     */
    ajaxPost: (uri, params = {}, mockData) =>
        ajaxFull(Cv.HTTP_METHOD.POST, true)(uri, params, mockData),
    microPost: (service, uri, params, mockData) =>
        ajaxFull(Cv.HTTP_METHOD.POST, true)(_buildApi(service, uri), params, mockData),
    /**
     * secure = true，安全模式的写方法，HttpMethod = PUT，底层调ajaxFull
     * @method ajaxPut
     * @param uri 该Ajax调用的Uri路径
     * @param params 请求参数
     * @param mockData 【Mock环境可用】模拟数据
     */
    ajaxPut: (uri, params = {}, mockData) =>
        ajaxFull(Cv.HTTP_METHOD.PUT, true)(uri, params, mockData),
    microPut: (service, uri, params, mockData) =>
        ajaxFull(Cv.HTTP_METHOD.PUT, true)(_buildApi(service, uri), params, mockData),
    /**
     * secure = true，安全模式的写方法，HttpMethod = DELETE，底层调ajaxFull
     * @method ajaxDelete
     * @param uri 该Ajax调用的Uri路径
     * @param params 请求参数
     * @param mockData 【Mock环境可用】模拟数据
     */
    ajaxDelete: (uri, params = {}, mockData) =>
        ajaxFull(Cv.HTTP_METHOD.DELETE, true)(uri, params, mockData),
    microDelete: (service, uri, params, mockData) =>
        ajaxFull(Cv.HTTP_METHOD.DELETE, true)(_buildApi(service, uri), params, mockData),
};
