import Rx from "rxjs";
import U from "underscore";
import Log from "./Ux.Log";
import Cv from "./Ux.Constant";
import Expr from "./Ux.Expr";
import Env from './Ux.Env';
import Sign from "./Ux.Sign";
import Dg from "./Ux.Debug";
import Immutable from 'immutable'
import Type from './Ux.Type';

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
    Sign.signature(api, method, params);
    // 追加Query
    const query = Expr.formatQuery(uri, params);
    // 最终请求路径
    api = "get" === method || "delete" === method
        ? `${Cv['ENDPOINT']}${api}${query}`
        : `${Cv['ENDPOINT']}${api}`;
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
        Dg.ensureToken(token);
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
    if (params.hasOwnProperty("$body")) {
        return JSON.stringify(params.$body);
    } else {
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
const ajaxResponse = (request, mockData = {}, params) =>
    // Mock开启时，返回Mock中data节点的数据
    (mockData['forceMock'] || (Cv.MOCK && mockData.mock))
        ? Promise.resolve(mockData.processor ? mockData.processor(mockData.data, params) : mockData.data)
        : fetch(request)
            .then(response => Log.response(request, response, request.method))
            .then(response => response.ok
                ? response.json().then(body => Promise.resolve(ajaxAdapter(body)))
                : response.json().then(data => Promise.reject({
                    ...data,
                    status: response.status,
                    statusText: response.statusText
                }))
            )
            .then(response => {
                // 是否存储响应信息
                if (Cv['DEBUG_AJAX']) {
                    Dg.dgFileJson({
                        request: params,
                        response: response
                    });
                }
                return response;
            })
            .catch(error => Promise.reject(error));
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
        Log.request(api, method, params);
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
    console.info(options);
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
 * 统一处理Epic，引入Mock的RxJs处理远程访问
 * @method rxEpic
 * @param type redux-act创建出来的Redux Action
 * @param promise 构造的Promise
 * @param processor 响应数据处理器，可用于处理response中的数据
 * @param mockData 【Mock环境可用】模拟数据
 * @example
 *
 *      // Act.Epic.js中的专用方法
 *      fnFetchRoomType : $action => Ux.rxEpic(
 *          $action.ofType(Types.fnFetchRoomType.getType()),
 *          hotel => Ux.ajaxGet("/api/room-types/hotel/:hid", {
 *              hid : hotel.key
 *          }),
 *          data => Ux.rxAssist(data, "room.type"),
 *          Mock.fnFetchRoomType
 *      )
 */
const rxEpic = (type, promise, processor = data => data, mockData = {}) => {
    if (type && U.isFunction(promise)) {
        // 触发Mock条件
        // 1. 打开Mock环境
        // 2. 提供Mock数据
        if (Cv.MOCK && mockData.mock) {
            let processed = mockData.data;
            return Rx.Observable.from(type)
                .map(action => action.payload)
                .map(data => Log.mock(data, mockData.processor ? mockData.processor(processed, data) : processed))
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
        console.error("[ Ajax ] rxEpic: type or promise is invalid.", type, promise);
    }
};
/**
 * 【Epic升级版】统一处理Epic，新函数，简化操作，替换rxEpic专用
 * @method rxEdict
 * @param type 专用Action
 * @param promise 构造的promise，这个版本Promise中的Mock直接包含在内
 * @param responser 后期响应处理
 * */
const rxEdict = (type, promise, responser = data => data) => {
    if (type && U.isFunction(promise)) {
        return $action => {
            const actionType = $action.ofType(type.getType());
            return Rx.Observable.from(actionType)
                .map(action => action.payload)
                .map(promise)
                .switchMap(promise =>
                    Rx.Observable.from(promise)
                        .map(responser)
                        .map(data => Env.dataOut(data))
                );
        }
    } else {
        console.error("[ Ajax ] rxEdict: type or promise is invalid.", type, promise);
    }
};

const _rxPromise = (container, nextPromise = []) => {
    // 读取第一个promise
    const middles = {};
    let promise = nextPromise[0](container.request, container.response);
    if (1 < nextPromise.length) {
        for (let idx = 1; idx < nextPromise.length; idx++) {
            promise = promise.then(data => {
                middles[idx] = data;
                container.next[idx] = data;
                return nextPromise[idx](container.request, container.response, middles);
            })
        }
    }
    return promise.then(data => {
        container.next[0] = data;
        return Promise.resolve(data);
    });
};
const rxEclat = (type, promise, responser = data => data, nextPromise = []) => {
    if (type && U.isFunction(promise)) {
        return $action => {
            const actionType = $action.ofType(type.getType());
            // 链式结构
            const container = {};
            container.next = Immutable.fromJS({}).toJS();
            const rxNext = (params, key = "request") => {
                container[key] = params;
                return params;
            };
            return Rx.Observable.from(actionType)
                .map(action => action.payload)
                .map(params => rxNext(params))
                .map(promise)
                // 触发后续流程专用的nextPromise
                .map(promise => promise
                    .then(data => Promise.resolve(rxNext(data, "response")))
                    .then(() => _rxPromise(container, nextPromise.map(item => item.ajax)))
                )
                .switchMap(promise => Rx.Observable.from(promise)
                    .map(() => {
                        // 合并最后的状态
                        const state = {};
                        const responseData = responser(container.response);
                        if (responseData) {
                            Object.assign(state, responseData);
                        }
                        const processors = nextPromise.map(item => item.processor);
                        Type.itObject(container.next, (key, value) => {
                            const fun = processors[key];
                            if (U.isFunction(fun)) {
                                const itemData = fun(value);
                                Object.assign(state, itemData);
                            }
                        });
                        return state;
                    })
                    .map(data => Env.dataOut(data))
                );
        }
    } else {
        console.error("[ Ajax ] rxEclat: type or promise is invalid.", type, promise, nextPromise);
    }
};
/**
 * 构造微服务路径专用
 * @param serviceName 服务名称
 * @param uri 服务专用URI
 */
const _buildApi = (serviceName = "", uri = "") => `/${serviceName}${uri}`.replace(/\/\//g, "/");
/**
 * @class Ajax
 * @description 远程Ajax访问专用API方法
 */
export default {
    rxEpic,
    // 单个Ajax的Promise
    rxEdict,
    // 连接两个Ajax的Promise，后一个和前一个存在依赖关系
    rxEclat,
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
