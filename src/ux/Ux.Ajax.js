import Rx from "rxjs";
import U from "underscore";
import Log from "./Ux.Log";
import Env from "./Ux.Env";
import Expr from "./Ux.Expr";
import Sign from "./Ux.Sign";
import Dg from "./Ux.Debug";

/**
 * Ajax远程访问过程中的Uri处理器
 * @function ajaxUri
 * @private
 * @param {String} uri 传入的原始路径，如：/api/app/:name
 * @param {String} method 传入的HTTP方法，默认为get
 * @param {Object} params 当前请求的参数数据
 * @returns {String}
 */
const ajaxUri = (uri, method = "get", params = {}) => {
    let api = Expr.formatExpr(uri, params);
    // 签名
    Sign.signature(api, method, params);
    // 追加Query
    const query = Expr.formatQuery(uri, params);
    // 最终请求路径
    api = "get" === method || "delete" === method
        ? `${Env.ENDPOINT}${api}${query}`
        : `${Env.ENDPOINT}${api}`;
    return api;
};
/**
 * Ajax远程访问过程中的Header处理器
 * @function ajaxHeader
 * @private
 * @param {Boolean} secure 是否为安全模式？安全模式会添加Authorization头。
 * @returns {Headers}
 */
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
/**
 * Ajax中的特殊参数处理器，如果包含了$body字段值，则将该值当做可处理的参数处理，
 * 该方法参数主要用于处理带路径参数的POST/PUT方法同时使用的场景
 * @function ajaxParams
 * @private
 * @param {Object} params
 * @returns {String}
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
 * Ajax中的响应处理器，Promise调用返回过后的响应专用处理器
 * @function ajaxResponse
 * @private
 * @param {Request} request 请求对象
 * @param {Object} mockData 【Mock环境可用】专用Mock响应处理
 * @returns {Promise<Response>}
 */
const ajaxResponse = (request, mockData = {}) =>
    // Mock开启时，返回Mock中data节点的数据
    mockData.mock ? Promise.resolve(mockData.data)
        : fetch(request)
            .then(response => Log.response(null, response, request.method))
            .then(response => response.ok
                ? response.json().then(body => Promise.resolve(body.data))
                : response.json().then(data =>
                    Promise.reject({
                        ...data,
                        status: response.status,
                        statusText: response.statusText
                    })
                )
            )
            .catch(error => Promise.reject(error));
/**
 * 【高阶函数：二阶】Ajax统一调用的读取方法，生成统一的Ajax远程读取方法
 * @function ajaxRead
 * @private
 * @param method HTTP方法
 * @param secure 是否安全模式
 */
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
/**
 * 【高阶函数：二阶】Ajax统一调用的读写双用方法，生成统一的Ajax远程调用方法，ajaxRead + ajaxWrite方法
 * @function ajaxFull
 * @private
 * @param method HTTP方法
 * @param secure 是否安全模式
 */
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
/**
 * Ajax日志函数，打印请求过程中的日志信息
 * @function _logAjax
 * @private
 * @param api 当前Ajax请求的Uri路径
 * @param method 当前Ajax使用的HTTP方法
 * @param params 当前Ajax请求的参数信息
 * @param mockData 【Mock环境可用】当前Ajax请求的Mock数据
 */
const _logAjax = (api, method, params, mockData) => {
    if (mockData && mockData.mock) {
        Log.mock(params, mockData.data, method + " " + api);
    } else {
        Log.request(api, method, params);
    }
};
/**
 * 【高阶函数：二阶】Ajax统一调用的读取方法，生成统一的Ajax远程写数据方法
 * @function ajaxWrite
 * @private
 * @param method HTTP方法
 * @param secure 是否安全模式
 */
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
 * 统一处理Epic，引入Mock的RxJs处理远程访问
 * @function rxEpic
 * @param type redux-act创建出来的Redux Action
 * @param promise 构造的Promise
 * @param processor 响应数据处理器，可用于处理response中的数据
 * @param mockData 【Mock环境可用】模拟数据
 * @param mockProcessor 【Mock环境可用】Mock环境的特殊处理器
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
/**
 * @class Ajax
 * @description 远程Ajax访问专用API方法
 */
export default {
    rxEpic,
    /**
     * secure = false，非安全模式的读取方法，HttpMethod = GET，底层调ajaxRead
     * @function ajaxFetch
     * @param uri 该Ajax调用的Uri路径
     * @param params 请求参数
     * @param mockData 【Mock环境可用】模拟数据
     */
    ajaxFetch: (uri, params = {}, mockData) =>
        ajaxRead(Env.HTTP_METHOD.GET)(uri, params, mockData),
    /**
     * secure = false，非安全模式的写方法，HttpMethod = POST，底层调ajaxWrite
     * @function ajaxPush
     * @param uri 该Ajax调用的Uri路径
     * @param params 请求参数
     * @param mockData 【Mock环境可用】模拟数据
     */
    ajaxPush: (uri, params = {}, mockData) =>
        ajaxWrite(Env.HTTP_METHOD.POST)(uri, params, mockData),
    /**
     * secure = true，安全模式的读取方法，HttpMethod = GET，底层调ajaxRead
     * @function ajaxGet
     * @param uri 该Ajax调用的Uri路径
     * @param params 请求参数
     * @param mockData 【Mock环境可用】模拟数据
     */
    ajaxGet: (uri, params = {}, mockData) =>
        ajaxRead(Env.HTTP_METHOD.GET, true)(uri, params, mockData),
    /**
     * secure = true，安全模式的写方法，HttpMethod = POST，底层调ajaxFull
     * @function ajaxPost
     * @param uri 该Ajax调用的Uri路径
     * @param params 请求参数
     * @param mockData 【Mock环境可用】模拟数据
     */
    ajaxPost: (uri, params = {}, mockData) =>
        ajaxFull(Env.HTTP_METHOD.POST, true)(uri, params, mockData),
    /**
     * secure = true，安全模式的写方法，HttpMethod = PUT，底层调ajaxFull
     * @function ajaxPut
     * @param uri 该Ajax调用的Uri路径
     * @param params 请求参数
     * @param mockData 【Mock环境可用】模拟数据
     */
    ajaxPut: (uri, params = {}, mockData) =>
        ajaxFull(Env.HTTP_METHOD.PUT, true)(uri, params, mockData),
    /**
     * secure = true，安全模式的写方法，HttpMethod = DELETE，底层调ajaxFull
     * @function ajaxDelete
     * @param uri 该Ajax调用的Uri路径
     * @param params 请求参数
     * @param mockData 【Mock环境可用】模拟数据
     */
    ajaxDelete: (uri, params = {}, mockData) =>
        ajaxFull(Env.HTTP_METHOD.DELETE, true)(uri, params, mockData)
};
