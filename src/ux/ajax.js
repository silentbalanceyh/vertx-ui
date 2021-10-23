// I.before.js
import Cv from "./constant";
import E from "./error";
import Abs from './abyss';
import T from './unity';
import Rx from './entity';
import Ele from './element';
// 开发专用
import Dev from './develop';

import {message, Modal} from "antd";
import {from} from "rxjs";
import {map, switchMap} from "rxjs/operators";

import Mock from "mock";

const {Logger: Log} = Dev;


const ajaxRead = (method = "get", secure = false) => (uri, params = {}, options) => {
    const $params = Abs.clone(params);
    const api = ajaxUri(uri, method, params);
    const headers = ajaxHeaderJ(secure, options);
    const request = new Request(api, ajaxOptions(method, headers, options));
    return ajaxResponse(request, $params);
};

const ajaxFull = (method = "post", secure = false) => (uri, params = {}, options = {}) => {
    const $params = Abs.clone(params);
    const api = ajaxUri(uri, method, params);
    const headers = ajaxHeaderJ(secure, options);
    const request = new Request(api, {
        ...ajaxOptions(method, headers, options),
        body: ajaxParams(params, options)
    });
    return ajaxResponse(request, $params);
};
const ajaxWrite = (method = "post", secure = false) => (uri, params = {}, options = {}) => {
    const $params = Abs.clone(params);
    const api = `${Cv['ENDPOINT']}${uri}`;
    const headers = ajaxHeaderJ(secure, options);
    const request = new Request(api, {
        ...ajaxOptions(method, headers, options),
        body: ajaxParams(params, options)
    });
    return ajaxResponse(request, $params);
};
/**
 * ## 「标准」`Ux.ajaxResource`
 *
 * **非安全方法**，直接从当前站点读取资源相关信息
 *
 * > 这种模式只处理当前站点的 uri 路径，不结合 ENDPOINT 的路径执行远程请求
 *
 * @memberOf module:_ajax
 * @method ajaxResource
 * @async
 * @param {String} uri 资源路径
 * @return {Promise<T>} 返回最终的 Promise
 */
const ajaxResource = (uri) => {
    const request = new Request(uri, {
        method: "get"
    });
    return fetch(request).then(data => data.text());
};
/**
 * ## 「标准」`Ux.ajaxUpload`
 *
 * **安全方法**（带token），上传专用的 Ajax 函数，文件上传专用的 Ajax 函数。
 *
 * @async
 * @memberOf module:_ajax
 * @param {String} uri 远程上传开放的Api接口路径
 * @param {FormData} file 文件内容相关信息（Html中的数据）
 * @param {Object} options Http请求头相关信息
 * @return {Promise<T>} 返回上传过后的 Promise
 */
const ajaxUpload = (uri, file, options = {}) => {
    // 构造MultiPart
    const fileData = new FormData();
    fileData.append('file', file);
    // 构造Api和参数
    const api = `${Cv['ENDPOINT']}${uri}`;
    const headers = new Headers();
    ajaxHeader(headers, true);
    const request = new Request(api, {
        ...ajaxOptions("POST", headers, options),
        body: fileData
    });
    return ajaxResponse(request, fileData);
};

const _ajaxDown = (uri, params, options = {}, method = "GET") => {
    const api = ajaxUri(uri, method, params);
    const headers = new Headers();
    ajaxHeader(headers, true);
    // 下载专用头设置，客户端只接受 octet-stream 格式
    headers.append(Cv.HTTP11.ACCEPT, "application/octet-stream");
    headers.append(Cv.HTTP11.CONTENT_TYPE, "application/octet-stream");
    // Download专用
    const request = new Request(api, {
        ...ajaxOptions(method, headers, options),
        // 解决无法传参的问题
        body: JSON.stringify(params)
    });
    return ajaxBlob(request, params);
};

/**
 * ## 「标准」`Ux.ajaxDownload`
 *
 * **安全方法**（带token），`GET`下载专用方法，下载内容会返回二进制数据
 *
 * @async
 * @memberOf module:_ajax
 * @param {String} uri 远程上传开放的Api接口路径
 * @param {Object} params 下载文件的专用参数
 * @param {Object} options Http请求头相关信息
 * @return {Promise<T>} 返回上传过后的 Promise
 */
const ajaxDownload = (uri, params, options) => _ajaxDown(uri, params, options);

/**
 * ## 「标准」`Ux.ajaxPull`
 *
 * **安全方法**（带token）， `POST`下载专用方法，下载内容会返回二进制数据
 *
 * @async
 * @memberOf module:_ajax
 * @param {String} uri 远程上传开放的Api接口路径
 * @param {Object} params 下载文件的专用参数，这种模式下一般存储于 Http 请求体 Body 中
 * @param {Object} options Http请求头相关信息
 * @return {Promise<T>} 返回上传过后的 Promise
 */
const ajaxPull = (uri, params, options) => _ajaxDown(uri, params, options, "POST");

const _buildApi = (serviceName = "", uri = "") => `/${serviceName}${uri}`.replace(/\/\//g, "/");

const Ajax = {
    ajaxResource,
    ajaxUpload,     // 上传
    ajaxPull,       // 下载（POST）
    ajaxDownload,   // 下载（GET）


    /**
     * ## 「标准」`Ux.ajaxFetch`
     *
     * **非安全方法**，GET开放性方法，从远程地址中直接读取远程请求数据的方法。
     *
     * @method ajaxFetch
     * @async
     * @memberOf module:_ajax
     * @param {String} uri 远程开放的Api接口路径
     * @param {Object} params 调用接口专用参数
     * @param {Object} options Http请求头相关信息
     * @return {Promise<T>} 返回调用接口的 Promise
     */
    ajaxFetch: (uri, params = {}, options) => ajaxRead(Cv.HTTP_METHOD.GET)(uri, params, options),


    /**
     * ## 「标准」`Ux.microFetch`
     *
     * **非安全方法**，GET开放性方法，微服务模式下读取远程请求数据的方法。
     *
     * @method microFetch
     * @async
     * @memberOf module:_ajax
     * @param {String} service 微服务模式中的服务名称
     * @param {String} uri 远程开放的Api接口路径
     * @param {Object} params 调用接口专用参数
     * @param {Object} options Http请求头相关信息
     * @return {Promise<T>} 返回调用接口的 Promise
     */
    microFetch: (service, uri, params = {}, options) =>
        ajaxRead(Cv.HTTP_METHOD.GET)(_buildApi(service, uri), params, options),

    /**
     *
     * ## 「标准」`Ux.ajaxPush`
     *
     * **非安全方法**，POST开放性方法，往远程地址推送数据的专用方法。
     *
     * @method ajaxPush
     * @async
     * @memberOf module:_ajax
     * @param {String} uri 远程开放的Api接口路径
     * @param {Object} params 调用接口专用参数
     * @param {Object} options Http请求头相关信息
     * @return {Promise<T>} 返回调用接口的 Promise
     */
    ajaxPush: (uri, params = {}, options) =>
        ajaxWrite(Cv.HTTP_METHOD.POST)(uri, params, options),


    /**
     *
     * ## 「标准」`Ux.microPush`
     *
     * **非安全方法**，POST开放性方法，微服务模式下推送数据的专用方法。
     *
     * @method microPush
     * @async
     * @memberOf module:_ajax
     * @param {String} service 微服务模式中的服务名称
     * @param {String} uri 远程开放的Api接口路径
     * @param {Object} params 调用接口专用参数
     * @param {Object} options Http请求头相关信息
     * @return {Promise<T>} 返回调用接口的 Promise
     */
    microPush: (service, uri, params, options) =>
        ajaxWrite(Cv.HTTP_METHOD.POST)(_buildApi(service, uri), params, options),


    /**
     * ## 「标准」`Ux.ajaxGet`
     *
     * **安全方法**（带token），GET开放性方法。
     *
     * @async
     * @memberOf module:_ajax
     * @param {String} uri 远程开放的Api接口路径
     * @param {Object} params 调用接口专用参数
     * @param {Object} options Http请求头相关信息
     * @return {Promise<T>} 返回调用接口的 Promise
     */
    ajaxGet: (uri, params = {}, options) =>
        ajaxRead(Cv.HTTP_METHOD.GET, true)(uri, params, options),


    /**
     * ## 「标准」`Ux.microGet`
     *
     * **安全方法**（带token），GET开放性方法。
     *
     * @async
     * @memberOf module:_ajax
     * @param {String} service 微服务模式中的服务名称
     * @param {String} uri 远程开放的Api接口路径
     * @param {Object} params 调用接口专用参数
     * @param {Object} options Http请求头相关信息
     * @return {Promise<T>} 返回调用接口的 Promise
     */
    microGet: (service, uri, params, options) =>
        ajaxRead(Cv.HTTP_METHOD.GET, true)(_buildApi(service, uri), params, options),


    /**
     * ## 「标准」`Ux.ajaxPost`
     *
     * **安全方法**（带token），POST开放性方法
     *
     * @async
     * @memberOf module:_ajax
     * @param {String} uri 远程开放的Api接口路径
     * @param {Object} params 调用接口专用参数
     * @param {Object} options Http请求头相关信息
     * @return {Promise<T>} 返回调用接口的 Promise
     */
    ajaxPost: (uri, params = {}, options) =>
        ajaxFull(Cv.HTTP_METHOD.POST, true)(uri, params, options),

    /**
     * ## 「标准」`Ux.microPost`
     *
     * **安全方法**（带token），POST开放性方法
     *
     * @async
     * @memberOf module:_ajax
     * @param {String} service 微服务模式中的服务名称
     * @param {String} uri 远程开放的Api接口路径
     * @param {Object} params 调用接口专用参数
     * @param {Object} options Http请求头相关信息
     * @return {Promise<T>} 返回调用接口的 Promise
     */
    microPost: (service, uri, params, options) =>
        ajaxFull(Cv.HTTP_METHOD.POST, true)(_buildApi(service, uri), params, options),


    /**
     * ## 「标准」`Ux.ajaxPut`
     *
     * **安全方法**（带token），PUT开放性方法
     *
     * @async
     * @memberOf module:_ajax
     * @param {String} uri 远程开放的Api接口路径
     * @param {Object} params 调用接口专用参数
     * @param {Object} options Http请求头相关信息
     * @return {Promise<T>} 返回调用接口的 Promise
     */
    ajaxPut: (uri, params = {}, options) =>
        ajaxFull(Cv.HTTP_METHOD.PUT, true)(uri, params, options),


    /**
     * ## 「标准」`Ux.microPut`
     *
     * **安全方法**（带token），PUT开放性方法
     *
     * @async
     * @memberOf module:_ajax
     * @param {String} service 微服务模式中的服务名称
     * @param {String} uri 远程开放的Api接口路径
     * @param {Object} params 调用接口专用参数
     * @param {Object} options Http请求头相关信息
     * @return {Promise<T>} 返回调用接口的 Promise
     */
    microPut: (service, uri, params, options) =>
        ajaxFull(Cv.HTTP_METHOD.PUT, true)(_buildApi(service, uri), params, options),


    /**
     * ## 「标准」`Ux.ajaxDelete`
     *
     * **安全方法**（带token），DELETE开放性方法
     *
     * @async
     * @memberOf module:_ajax
     * @param {String} uri 远程开放的Api接口路径
     * @param {Object} params 调用接口专用参数
     * @param {Object} options Http请求头相关信息
     * @return {Promise<T>} 返回调用接口的 Promise
     */
    ajaxDelete: (uri, params = {}, options) =>
        ajaxFull(Cv.HTTP_METHOD.DELETE, true)(uri, params, options),


    /**
     * ## 「标准」`Ux.microDelete`
     *
     * **安全方法**（带token），DELETE开放性方法
     *
     * @async
     * @memberOf module:_ajax
     * @param {String} service 微服务模式中的服务名称
     * @param {String} uri 远程开放的Api接口路径
     * @param {Object} params 调用接口专用参数
     * @param {Object} options Http请求头相关信息
     * @return {Promise<T>} 返回调用接口的 Promise
     */
    microDelete: (service, uri, params, options) =>
        ajaxFull(Cv.HTTP_METHOD.DELETE, true)(_buildApi(service, uri), params, options),
};

const calculateKey = (request, params) => {
    let api = request.url;
    // 去掉 FormData 类型的数据
    if (!FormData.prototype.isPrototypeOf(params)) {
        Abs.itObject(params, (k, v) => {
            // 还原将 key / id 全部处理掉，处理路径参数
            if (0 < api.indexOf(v)) {
                api = api.replace(v, `$${k}`);
            }
        })
    }
    const method = request.method;
    const regex = new RegExp(Cv['ENDPOINT'], "g");
    let path = api.replace(regex, "").replace(/\//g, '_');
    if (0 < path.indexOf("?")) {
        path = path.split('?')[0];
    }
    const requestMethod = method.toLowerCase();
    return `${requestMethod}${path}`;
};
const mockAjax = async (request = {}, params = {}, executor = {}) => {
    /*
     * 同时开启了 DEBUG 和 MOCK
     */
    const api = request.url;
    const method = request.method;
    const fnExecute = async () => {
        Log.request(request, params, T.token());
        return await executor();
    };
    if (Cv.MOCK && Cv.DEBUG) {
        const mockKey = calculateKey(request, params);
        /*
         * 检查是否开启了mock
         */
        Dev.dgDebug({mockKey}, "当前请求的 mock key", "#545454");
        if (Mock[mockKey]) {
            const mockData = Mock[mockKey];
            if (mockData.mock) {
                /* Mock日志 */
                Log.mock(params, mockData.data, method + " " + api);
                let response = {};
                if (Abs.isFunction(mockData.processor)) {
                    /* 带 processor 流程 */
                    const source = Abs.clone(mockData.data);
                    let called = mockData.processor(source, Abs.clone(params));
                    if (called instanceof Promise) {
                        let ok = await called;
                        if (ok['_error']) {
                            ok = Abs.clone(ok);
                            called = {
                                data: ok,
                                _error: ok['_error']
                            }
                        } else {
                            called = ok;
                        }
                    }
                    await Dev.Logger.response(called, params, request, true);
                    response = await Abs.promise(called);
                } else {
                    /*
                     * 不带 processor 的 mock 流程
                     */
                    await Dev.Logger.response(mockData.data, params, request, true);
                    response = await Abs.promise(mockData.data);
                }
                if (!response) response = {}
                if (response.continue) {
                    return await fnExecute();
                } else {
                    return response;
                }
            } else {
                /* 接口数据Mock关闭，真实请求 */
                return await fnExecute();
            }
        } else {
            /* 无法查找Mock对应的key，真实请求 */
            return await fnExecute();
        }
    } else {
        /* 全局环境Mock未打开，真实请求 */
        return await fnExecute();
    }
}
const _ajaxExtract = (request, params, body, response) => {
    // Body的打印处理
    Dev.Logger.response(body, params, request);
    // 最终的返回处理
    if (response.ok) {
        return Promise.resolve(body, "config");
    } else {
        Dev.dgAjax(body, "Remote Error:");
        return Promise.reject({data: body});
    }
};
const ajaxResponse = async (request, params) => mockAjax(request, params,
    async () => {
        const response = await fetch(request);
        let body = {};
        if (response.ok) {
            if (200 === response.status) {
                body = await response.json();
                // 任何时候都需要调用适配器，包括errors
                body = ajaxAdapter(body);
            } else if (204 === response.status) {
                // null
                body = {};
            }
        } else {
            let json = null;
            try {
                json = await response.json();
                // 任何时候都需要调用适配器，包括errors
                json = ajaxAdapter(json);
            } catch (error) {
                json = {
                    data: error.toString(),
                    _error: true
                };
            }
            body = {
                _error: true,
                ...json,
                status: response.status,
                statusText: response.statusText
            };
        }
        return _ajaxExtract(request, params, body, response);
    });

const ajaxBlob = async (request, params = {}) => mockAjax(request, params,
    async () => {
        const response = await fetch(request);
        let body = new Blob(["No Content"]);
        // 任何时候都需要调用适配器，包括errors
        if (response.ok) {
            body = await response.blob();
        } else {
            body = {
                stream: body,
                status: response.status,
                statusText: response.statusText
            };
        }
        return _ajaxExtract(request, params, body, response);
    });
const ajaxPatternValue = (criteria = {}, collector = {}) => {
    // eslint-disable-next-line
    for (const key in criteria) {
        if (criteria.hasOwnProperty(key)) {
            let value = criteria[key];
            if (!Abs.isArray(value) && Abs.isObject(value)) {
                ajaxPatternValue(value, collector);
            } else {
                /*
                 * 处理 field,op 的格式，只提取 field
                 */
                let field;
                if (0 < key.indexOf(',')) {
                    field = key.split(',')[0];
                } else {
                    field = key;
                }
                if ("" !== field) {
                    /*
                     * value 处理，如果数组取第一个元素替换
                     */
                    if (Abs.isArray(value)) {
                        value = value[0];
                    }
                    collector[field] = value;
                }
            }
        }
    }
};
const ajaxPatternUri = (uri, params = {}) => {
    let api = uri;
    // 只有带有路径参数的才执行这个递归
    if (params.hasOwnProperty("criteria") && 0 < api.indexOf(":")) {
        try {
            const $params = {};
            ajaxPatternValue(params.criteria, $params);
            Dev.dgDebug($params, "[Ux] 拉平过后的数据处理：");
            api = T.formatExpr(api, $params, true);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    return api;
};
const ajaxUri = (uri, method = "get", params = {}) => {
    let api = T.formatExpr(uri, params, true);
    // 针对查询引擎的特殊填充
    api = ajaxPatternUri(api, params);
    // 签名
    if (Cv.SIGN) {
        T.signature(api, method, params);
    }
    // 追加Query
    const query = T.formatQuery(uri, params);
    // 最终请求路径
    api = "get" === method || "delete" === method ?
        `${Cv['ENDPOINT']}${api}${query}` :
        `${Cv['ENDPOINT']}${api}`;
    return api;
};
const ajaxXSRF = (headers = {}) => {
    // TODO: 执行 xsrfToken 请求
    const xsrfToken = undefined;
    // eslint-disable-next-line
    if (xsrfToken) {
        headers.append(Cv.HTTP11.XSRF_TOKEN, xsrfToken);
    }
};
const ajaxHeaderJ = (secure = false, options = {}) => {
    const headers = new Headers();
    headers.append(Cv.HTTP11.ACCEPT, Cv.MIMES.JSON);
    if (!options.hasOwnProperty(Cv.HTTP11.CONTENT_TYPE)) {
        headers.append(Cv.HTTP11.CONTENT_TYPE, Cv.MIMES.JSON);
    }
    // 处理Authorization
    ajaxHeader(headers, secure);
    return headers;
};
const ajaxHeader = (headers = {}, secure = false) => {
    if (secure) {
        const token = T.token();
        E.fxTerminal(!token, 10065, token);
        headers.append(Cv.HTTP11.AUTHORIZATION, token);
    }
    /* 启用了 X_ 的Header发送请求 */
    if (Cv['X_HEADER_SUPPORT']) {
        /* X_APP_KEY */
        const appKey = T.Storage.getDirect(Cv.X_APP_KEY);
        if (appKey) headers.append(Cv.X_HEADER.X_APP_KEY, appKey);
        /* X_APP_ID */
        const appId = T.Storage.getDirect(Cv.X_APP_ID);
        if (appId) headers.append(Cv.X_HEADER.X_APP_ID, appId);
        /* X_SIGMA */
        const sigma = T.Storage.getDirect(Cv.X_SIGMA);
        if (sigma) headers.append(Cv.X_HEADER.X_SIGMA, sigma);
        /* X_LANG */
        const language = Cv['LANGUAGE'] ? Cv['LANGUAGE'] : "cn";
        if (language) headers.append(Cv.X_HEADER.X_LANG, language);
    }
    ajaxXSRF(headers);
};
const ajaxParams = (params = {}, options = {}) => {
    let isForm = false;
    if (options.hasOwnProperty(Cv.HTTP11.CONTENT_TYPE)) {
        isForm = Cv.MIMES.FORM === options[Cv.HTTP11.CONTENT_TYPE];
    }
    if (isForm) {
        const formData = new FormData();
        Object.keys(params).forEach(key => {
            if (Abs.isObject(params[key]) || Abs.isArray(params[key])) {
                formData.append(key, JSON.stringify(params[key]));
            } else {
                formData.append(key, params[key]);
            }
        });
        return formData;
    } else {
        const language = Cv['LANGUAGE'] ? Cv['LANGUAGE'] : "cn";
        const itLang = (data) => Abs.itObject(data, (field, value) => {
            if (Abs.isArray(value)) {
                data[field].filter(Abs.isObject).forEach(item => itLang(item));
            } else {
                if (Abs.isObject(data) && !Abs.isArray(data)) {
                    data.language = language;
                }
            }
        });
        let requestBody;
        if (params.hasOwnProperty("$body")) {
            if (!Abs.isArray(params.$body)) {
                itLang(params.$body);
            }
            requestBody = JSON.stringify(params.$body);
        } else {
            // 拷贝 language = cn 的问题
            if (!params.hasOwnProperty('criteria')) {
                itLang(params);
            }
            requestBody = JSON.stringify(params);
        }
        return requestBody;
    }
};
const ajaxAdapter = (body = {}) => {
    /*
     * body 中的数据结构用于处理直接 body 的内容
     * 带有 data，zero 规范中的内容
     */
    if (body.data) {
        const {
            data,        // 数据部分
            acl,         // ACL 权限控制
            qr,          // 查询条件节点
            meta,        // 元数据配置
            extension,   // 扩展配置
            plugin,      // 插件配置
        } = body;
        /*
         * 将响应数据通过 __ 注入到数据内部
         * 因为JS是弱类型语言，所以不论是 Array / Object 都可以直接挂载 __ 属性，所以附加属性
         * 全部都挂载在 data 节点中，其中这些节点包含：
         * 1. data部分：{}, [] 相关结构
         * 2. 扩展节点用途
         * - acl：「已启用」权限控制专用节点，提供ACL附加信息
         * - qr：「已启动」后台视图view对应的查询条件节点
         * - meta：元数据相关节点
         * - extension：后端扩展节点
         * - plugin：前端插件扩展节点
         */
        Object.assign(data, Ele.valueValid({
            __acl: acl,
            __qr: qr,
            __meta: meta,
            __extension: extension,
            __plugin: plugin
        }))
        return data;
    } else return body;
};
const ajaxOptions = (method, headers, inputOpts = {}) => {
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
    /*
     * 合并传入专用
     */
    if (!Abs.isEmpty(inputOpts)) {
        Object.assign(options, inputOpts);
    }
    return options;
};

/**
 * ## 「标准」`Ux.messageSuccess`
 *
 * Ant Design 中的 `message` 响应消息调用，内部调用 `message.success`。
 *
 * 1. 如果 content 是 String，则直接呈现该消息。
 * 2. 如果 content 是 Object，则提取 `model.success` 节点中的消息（旧代码兼容）。
 *
 * @memberOf module:_ajax
 * @param {String|Object} content 消息呈现的内容
 * @param {Number} duration 消息显示的时间，以秒为单位
 */
const messageSuccess = (content = "", duration = 1.628) => {
    if ("string" === typeof content) {
        message.config({maxCount: 1});
        message.success(content, duration);
    } else if (Abs.isObject(content)) {
        const {modal: {success = {}}} = content;
        /*
         * 递归调用
         */
        if ("string" === typeof success.content) {
            messageSuccess(success.content);
        }
    } else {
        console.warn("[ Ux ] 没有被显示的成功消息：", content);
    }
};

/**
 * ## 「标准」`Ux.messageFailure`
 *
 * Ant Design 中的 `message` 响应消息调用，内部调用 `message.error`。
 *
 * 1. 如果 content 是 String，则直接呈现该消息。
 * 2. 如果 content 是 Object，则提取 `model.failure` 节点中的消息（旧代码兼容）。
 *
 *
 * @memberOf module:_ajax
 * @param {String|Object} content 消息呈现的内容
 * @param {Number} duration 消息显示的时间，以秒为单位
 */
const messageFailure = (content = "", duration = 1.628) => {
    if ("string" === typeof content) {
        message.config({maxCount: 1});
        message.error(content, duration);
    } else if (Abs.isObject(content)) {
        const {modal} = content;
        /*
         * 递归调用
         */
        const {error = {}} = modal ? modal : {};
        if ("string" === typeof error.content) {
            messageFailure(error.content);
        }
    } else {
        console.warn("[ Ux ] 没有被显示的失败消息：", content);
    }
};


/**
 * ## 「标准」`Ux.messageCatch`
 *
 * 和 Zero 框架中的数据规范配合的异常处理函数，Zero中的异常规范如下，code 为 Zero 的内部错误代码：
 *
 * ```json
 * {
 *     "code": -100017,
 *     "message": "异常系统消息",
 *     "info": "可读的界面交互信息"
 * }
 * ```
 *
 * @memberOf module:_ajax
 * @param {Object} error Zero中的异常对象。
 * @param {Function} callback 异常信息处理过后的回调函数。
 */
const messageCatch = (error = {}, callback) => {
    const {data = {}} = error;
    // console.error(error);   // 调试专用
    if (data.info) {
        messageFailure(data.info, 2);
    } else {
        if (data.message) {
            messageFailure(data.message, 2);
        }
    }
    if (Abs.isFunction(callback)) {
        callback();
    }
};
// O.ajax.callback.js

const ajaxEnd = (reference, redux) => () => {
    reference.setState({
        $loading: false,
        $submitting: false
    });
    /*
     * 专用处理
     */
    if (redux) {
        T.writeSubmit(reference, false);
    }
    /*
     * 处理 doSubmitting 函数（Extension中专用）
     */
    const {doSubmitting} = reference.props;
    if (Abs.isFunction(doSubmitting)) {
        doSubmitting(false);
    }
};
const _fromHoc = (reference = {}, key = "") => {
    E.fxTerminal("string" !== typeof key, 10000, "string", typeof key);
    if (reference) {
        const {$hoc} = reference.state ? reference.state : {};
        return ($hoc) ? $hoc._(key) : null;
    } else {
        console.error("传入第一个参数 reference 为 null 或 undefined");
    }
};


/**
 * ## 「标准」`Ux.ajaxError`
 *
 * 错误信息专用函数，注，这里的 Component 的引用必须是绑定了`cab/cn/`中的资源文件的组件，
 * 资源文件中会自动包含 _dialog 的窗口键值，error的数据结构如：
 *
 * ```json
 * {
 *     "code": "错误代码，整数",
 *     "message": "错误信息",
 *     "info": "前端可读信息"
 * }
 * ```
 *
 * 处理最终的响应数据时候还需要考虑 redux 参数
 *
 * 1. redux = true，启用 redux 流程
 * 2. redux = false，不启用 redux 流程，仅使用当前组件流程，React 中的 state 状态流程
 *
 * @memberOf module:_ajax
 * @param {React.Component} reference React组件引用
 * @param {Object} error Zero 的核心错误响应信息
 * @param {boolean} redux 是否启用了 redux 流程写 redux 的树形数据
 */
const ajaxError = (reference, error = {}, redux = false) => {
    const {data = {}} = error;
    if (data.code < 0 && data.info) {
        /*
         * 这种情况下，错误信息来自于服务端
         */
        let dialog = _fromHoc(reference, "dialog");
        if (!dialog) dialog = {};
        const config = {
            title: dialog.error, content: data.info,
            maskClosable: false,
        };
        config.onOk = ajaxEnd(reference, redux);
        Modal.error(config);
        // return Promise.reject(error);
    } else {
        /*
         * 是否包含了 client
         */
        if (data.client) {
            /*
             * 根据 redux 执行 onEnd
             */
            ajaxEnd(reference, redux)();
            // return Promise.reject(error);
        } else {
            console.error("[ Ux ] 核心错误！", error);
        }
    }
};
/* 私有方法 **/
const _setType = (config = {}, modal = {}, key) => {
    if (modal.confirm && modal.confirm.hasOwnProperty(key)) {
        config.mode = "confirm";
        config.pattern = modal.confirm[key];
    }
    if (modal.error && modal.error.hasOwnProperty(key)) {
        config.mode = "error";
        config.pattern = modal.error[key];
    }
    if (modal.success && modal.success.hasOwnProperty(key)) {
        config.mode = "success";
        config.pattern = modal.success[key];
    }
    if (!config.mode || !config.pattern) {
        console.error(`窗口配置 _modal 中无法找到 ${key}`);
    }
};
/* 私有方法 **/
const _showDialog = (reference, dialogConfig = {}, data) => {
    const {title, content, mode} = dialogConfig;
    const config = {title, content, maskClosable: false, destroyOnClose: true};
    const FUN = {
        "success": Modal.success,
        "error": Modal.error,
        "confirm": Modal.confirm,
    };
    const fnDialog = FUN[mode];
    config.onCancel = ajaxEnd(reference, dialogConfig.redux);
    return new Promise((resolve) => {
        config.onOk = () => {
            /*
             * 执行一次
             */
            ajaxEnd(reference, dialogConfig.redux)();
            resolve(data)
        };
        fnDialog(config);
    })
};


/**
 *
 * ## 「标准2阶」`Ux.ajax2Dialog`
 *
 * 直接封装 ajaxDialog 的2阶函数，函数参数如下：
 *
 * | 参数名 | 类型 | 说明 |
 * |:--- |:---|:---|
 * | data | any | 响应的核心数据信息，Object 或 Array |
 *
 * @memberOf module:_ajax
 * @param {React.Component} reference React组件引用。
 * @param {String} key 窗口所消费的资源文件中的 `key` 键值。
 * @param {boolean} redux 是否启用 redux 流程。
 * @return {function(*): Promise<T>} 返回函数，该函数会消费响应信息得到 Promise。
 */
const ajax2Dialog = (reference, key, redux = false) => (data) =>
    ajaxDialog(reference, {key, data, redux});

/**
 * ## 「标准」`Ux.ajaxDialog`
 *
 * 弹出窗口专用函数，调用 Ant Design 中的 `Modal` 的弹出框处理，success, error, confirm 专用处理函数。
 * 在传入的 reference 引用中，props 属性中必须包含 `config` 对象（窗口配置信息），它的结构如下：
 *
 * ### 1. key 为 String
 *
 * 如果传入的 `key` 是字符串，config 的配置结果如，这份结果来自资源文件中的 `shared.json`
 *
 * ```json
 * {
 *     "dialog": {
 *         "modal": "模式信息",
 *         "title": {
 *              "success": "信息",
 *              "failure": "警告",
 *              "error": "错误",
 *              "confirm": "提示"
 *         }
 *     }
 * }
 * ```
 *
 * 执行了计算过后，会处理以下步骤
 *
 * 1. 根据 mode 计算窗口标题，从 `dialog`中的三种窗口中去读。
 * 2. 根据 pattern 数据计算最终的格式，Modal需要的。
 *
 * 计算的最终配置格式如：
 *
 * ```json
 * {
 *     "mode": "success | confirm | error",
 *     "title": "标题文本",
 *     "content": "内容使用 pattern 计算，执行 formatExpr 的格式化",
 *     "redux": "是否开启 redux 流程"
 * }
 * ```
 *
 * ### 2. key 为 Object
 *
 * 这是第二种配置模式，传入的 key 转换成 configuration 过后的数据格式如：
 *
 * ```json
 * {
 *     "title": "标题信息",
 *     "pattern": "未解析的模式",
 *     "content": "二选一，是否执行 formatExpr 的格式化操作",
 *     "model": "success | confirm | error",
 *     "redux": "是否开启 redux 流程"
 * }
 * ```
 *
 * ### 3. 最终格式
 *
 * 不论 key 的传入类型是哪种，最终的处理格式如"
 *
 * ```json
 * {
 *     "title": "",
 *     "content": "",
 *     "mode": ""
 *     "redux": ""
 * }
 * ```
 *
 * @memberOf module:_ajax
 * @param {React.Component} reference React组件引用。
 * @param {Object | Array} data 响应数据处理格式。
 * @param {String} key 窗口所消费的资源文件中的 `key` 键值。
 * @param {boolean} redux 是否启用 redux 流程。
 * @return {Promise<T>} 返回效应窗口之外最终的 Promise。
 */
const ajaxDialog = (reference, {
    data, key, redux = false
}) => {
    const {config = {}} = reference.props;
    const {dialog = {}} = config;
    /*
     * modal:{
     *      confirm: （ 第一优先级 ）
     *      error:   （ 第二优先级 ）
     *      success: （ 第三优先级 ）
     * }
     */
    const dialogConfig = {};
    if ("string" === typeof key) {
        const {modal, title = {}} = dialog;
        _setType(dialogConfig, modal, key);
        /*
         * 计算结果
         * mode：success, failure, confirm
         * pattern：抓取的格式数据
         */
        dialogConfig.title = title[dialogConfig.mode];
        /*
         * 使用数据执行 format
         */
        if (dialogConfig.pattern) {
            dialogConfig.content = T.formatExpr(dialogConfig.pattern, data);
        }
        dialogConfig.redux = redux;     // 连接 redux 处理响应
    } else {
        if (Abs.isObject(key)) {
            // 配置模式
            const configuration = Abs.clone(key);
            dialogConfig.title = configuration.title;
            if (configuration.pattern) {
                dialogConfig.content = T.formatExpr(configuration.pattern, data);
            } else {
                dialogConfig.content = configuration.content;
            }
            dialogConfig.mode = configuration.mode;
            dialogConfig.redux = redux;     // 连接 redux 处理响应
        }
    }
    return _showDialog(reference, dialogConfig, data);
};

/**
 * ## 「标准2阶」`Ux.ajax2Message`
 *
 * 直接封装 ajaxMessage 的2阶函数，函数参数如下：
 *
 * | 参数名 | 类型 | 说明 |
 * |:--- |:---|:---|
 * | data | any | 响应的核心数据信息，Object 或 Array |
 *
 * @memberOf module:_ajax
 * @param {React.Component} reference React组件引用。
 * @param {String} key 窗口所消费的资源文件中的 `key` 键值。
 * @param {boolean} redux 是否启用 redux 流程。
 * @return {function(*): Promise<T>} 返回函数，该函数会消费响应信息得到 Promise。
 */
const ajax2Message = (reference, key, redux = false) => (data) =>
    ajaxMessage(reference, {key, data, redux});
/**
 * ## 「标准」`Ux.ajaxMessage`
 *
 * 该函数只支持一种格式，config 的配置结果如，这份结果来自资源文件中的 `shared.json`
 * 但由于是 message 所以只考虑最终的 pattern 配置，并且使用 data 来执行 formatExpr 得到最终
 * 的 content 相关数据，消息只执行两种模式
 *
 * * success：成功相关信息
 * * <any>：其他模式，直接执行 failure 的错误消息提示
 *
 * @memberOf module:_ajax
 * @param {React.Component} reference React组件引用。
 * @param {Object | Array} data 响应数据处理格式。
 * @param {String} key 窗口所消费的资源文件中的 `key` 键值。
 * @return {Promise<T>} 返回效应窗口之外最终的 Promise。
 */
const ajaxMessage = (reference, {
    data, key,
}) => {
    const {config = {}} = reference.props;
    const {dialog = {}} = config;
    /*
     * modal:{
     *      confirm: （ 第一优先级 ）
     *      error:   （ 第二优先级 ）
     *      success: （ 第三优先级 ）
     * }
     */
    const {modal} = dialog;
    const dialogConfig = {};
    _setType(dialogConfig, modal, key);
    /*
     * 使用数据执行 format
     */
    if (dialogConfig.pattern) {
        const message = T.formatExpr(dialogConfig.pattern, data);
        if ("success" === dialogConfig.mode) {
            messageSuccess(message);
        } else {
            messageFailure(message);
        }
    }
    return Abs.promise(data);
};


/**
 * ## 「标准2阶」`Ux.ajax2True`
 *
 * 当前 ajax 比较特殊，ajax 请求只会响应 true 或 false，根据最终结果执行相关操作
 *
 * @memberOf module:_ajax
 * @param {Function} consumer 执行的核心函数，在响应数据为 true 时执行该函数
 * @param {String} content 消息中呈现的消息内容
 * @return {Function} 返回一个函数消费 true | false 的相关结果
 */
const ajax2True = (consumer, content) => (result) => {
    if (result) {
        if (Abs.isFunction(consumer)) {
            consumer();
            if (content) {
                messageSuccess(content);
            }
            return Abs.promise(result);
        } else {
            return E.fxReject(10106);
        }
    } else {
        return E.fxReject(10107);
    }
};

/**
 * ## 「引擎」`Ux.ajaxEager`
 *
 * 异步表格列渲染专用预处理函数。在表格渲染中，如果使用了字典如：
 *
 * ### 字典配置
 *
 * ```json
 * [
 *      {
 *          "key": "9db923a3-e13b-4e4f-b468-8f026c9aa1ab",
 *          "name": "测试标签"
 *      },
 *      {
 *          "key": "72180b29-8c33-4419-a312-405d66a67521",
 *          "name": "正式标签"
 *      },
 *      {
 *          "key": "1dd8ff65-b570-483d-a98d-fe987fd25c03",
 *          "name": "特殊标签"
 *      }
 * ]
 * ```
 *
 * 上述结构中，表格列里存储的数据是 key，而不是 name，但在表格呈现时需要呈现 name字段的信息，这种情况下需要执行 ajaxEager
 * 进行预处理。如配置和数据分别如下：
 *
 * ### config 配置
 *
 * ```json
 * [
 *      {
 *          "dataIndex": "labelKey",
 *          "title": "标签",
 *          "$render": "USER",
 *          "$config": {
 *              "uri": "异步专用Ajax",
 *              "expr": "呈现专用表达式",
 *              "field": "name，读取数据中需要解析的字段"
 *          }
 *      }
 * ]
 * ```
 *
 * ### data 数据
 *
 * ```json
 * [
 *      { labelKey:"9db923a3-e13b-4e4f-b468-8f026c9aa1ab", name:"记录1" },
 *      { labelKey:"9db923a3-e13b-4e4f-b468-8f026c9aa1ab", name:"记录2" },
 *      { labelKey:"72180b29-8c33-4419-a312-405d66a67521", name:"记录3" },
 *      { labelKey:"9db923a3-e13b-4e4f-b468-8f026c9aa1ab", name:"记录4" },
 *      { labelKey:"72180b29-8c33-4419-a312-405d66a67521", name:"记录5" },
 *      { labelKey:"72180b29-8c33-4419-a312-405d66a67521", name:"记录6" },
 *      { labelKey:"72180b29-8c33-4419-a312-405d66a67521", name:"记录7" },
 *      { labelKey:"72180b29-8c33-4419-a312-405d66a67521", name:"记录8" }
 * ]
 * ```
 *
 * ### 核心分析
 *
 * 上述数据中，只有两类`labelKey`出现，如果表格的每个单元格都调用 Ajax 异步处理数据，那么上述数据会执行`8`次异步访问记录
 * 而 `ajaxEager` 函数就是为这种情况量身打造的异步渲染函数，如果调用`ajaxEager`则只会访问两次，通过这种方式在一页呈现数据
 * 量大的时候会大规模减少和服务端的交互，为了性能考虑，可以使用这个函数来实现，上述例子中最终函数会返回如下数据格式。
 *
 * ```json
 * {
 *      "9db923a3-e13b-4e4f-b468-8f026c9aa1ab": "测试标签",
 *      "72180b29-8c33-4419-a312-405d66a67521": "正式标签"
 * }
 * ```
 *
 * 上述结构是当前页的数据中的数据，`特殊标签`由于在本页数据中没使用，所以不会读取到，ajaxEager函数主要的实现考虑有两点：
 *
 * * 减少和服务端交互的次数，根据本页数据直接分页构造分组型请求。
 * * 减少所需数据量，只读取合法字典中的数据。
 *
 * @async
 * @memberOf module:_ajax
 * @param {ReactComponent} reference 【保留】React组件引用
 * @param {Array} columns 表格配置中的 `columns` 属性
 * @param {Array} data 表格已经加载好的二维数据信息
 * @return {Promise<T>} 特殊结构处理表格渲染专用
 */
const ajaxEager = (reference, columns = [], data = []) => {
    // console.info(columns);
    const lazyAsync = [];
    columns.forEach(column => {
        const config = column.$config;
        if (Abs.isObject(config)) {
            const {uri, field, expr, batch = false} = config;
            if (batch) {
                /*
                 * 批量处理只能使用查询引擎
                 */
                const dataKeys = data.map(item => item[column.dataIndex]);
                const criteria = {};
                criteria[`key,i`] = dataKeys;
                lazyAsync.push(Ajax.ajaxPost(uri, {criteria}).then((response = {}) => {
                    const {list = []} = response;
                    /*
                     * 批量连接，直接构造
                     */
                    const result = {};
                    list.forEach(item => {
                        let value;
                        if (expr) {
                            value = T.formatExpr(expr, item, true);
                        } else {
                            value = item[field];
                        }
                        result[item.key] = value;
                    });
                    if (column["$empty"]) {
                        result['undefined'] = column["$empty"];
                    }
                    return Abs.promise(result);
                }));
            } else {
                /*
                 * 将 data 按 column 分组，原始模式
                 */
                const dataMap = Ele.elementGroup(data, column.dataIndex);
                const vertical = [];
                const verticalKeys = Object.keys(dataMap);
                verticalKeys.forEach(key => {
                    if ("undefined" === key) {
                        vertical.push(Abs.promise(column["$empty"] ? column['$empty'] : ""));
                    } else if (key.length !== 36) {
                        vertical.push(Abs.promise(column["$empty"] ? column['$empty'] : key));
                    } else {
                        vertical.push(Ajax.ajaxGet(uri, {key}).then(result => {
                            let value;
                            if (Abs.isEmpty(result)) {
                                value = undefined;
                            } else {
                                if (expr) {
                                    value = T.formatExpr(expr, result, true);
                                } else {
                                    value = result[field];
                                }
                            }
                            return Abs.promise(value);
                        }));
                    }
                });
                /*
                 * vertical 结果
                 */
                lazyAsync.push(Abs.parallel(vertical).then(response => {
                    const result = {};
                    response.forEach((each, keyIndex) => {
                        result[verticalKeys[keyIndex]] = each;
                    });
                    return Abs.promise(result);
                }));
            }
        }
    });
    return Abs.parallel(lazyAsync)
        .then(response => {
            const lazyKeys = columns.map(column => column.dataIndex);
            const lazy = {};
            response.forEach((each, index) => {
                lazy[lazyKeys[index]] = each;
            });
            return Abs.promise(lazy);
        })
};

const ajaxFun = {
    get: Ajax.ajaxGet,
    post: Ajax.ajaxPost,
    put: Ajax.ajaxPut,
    fetch: Ajax.ajaxFetch,
    push: Ajax.ajaxPush,
    delete: Ajax.ajaxDelete
};


/**
 * ## 「标准」`Ux.asyncTrue`
 *
 * 异步验证专用函数，不返回 Promise，直接使用 `callback`模式，主要在 `validator` 中使用，几个参数的格式如下：
 *
 * ### config 格式
 *
 * ```json
 * {
 *     method: "get | post | put | fetch | push | delete",
 *     uri: "访问Ajax的路径信息",
 * }
 * ```
 *
 * ### callback 格式
 *
 * ```json
 * {
 *     success: "成功的回调函数",
 *     failure: "失败的回调函数"
 * }
 * ```
 *
 * 如果 callback 返回值是 true，则执行 success；如果 callback 返回值是 false，则执行 failure，二选一的 callback 执行，
 * 而这里其实不分 `success / failure`，仅根据成功响应过后的 `true/false`选择不同函数执行。
 *
 * ### mock 格式
 *
 * > 该格式目前通常不使用，需要使用则直接传入 mock 完成。
 *
 * ```json
 * {
 *     mock: "true | false，是否开启mock",
 *     data: "{} Mock的核心数据格式",
 *     processor: "是否执行响应格式的处理专用"
 * }
 * ```
 *
 * @async
 * @memberOf module:_ajax
 * @param {Object} config 异步验证配置信息
 * @param {Object} params 核心参数信息，传入 Ajax 的数据信息
 * @param {Object} callback 回调函数结构
 * @param {JObject} mock 模拟数据格式信息
 */
const asyncTrue = (config = {}, params = {}, callback = {}, mock = {}) => {
    const ajaxFn = ajaxFun[config.method ? config.method.toLowerCase() : 'get'];
    const uri = config.uri;
    if (uri && ajaxFn) {
        ajaxFn(uri, params, mock).then(data => {
            if (true === data) {
                if (callback.success) {
                    callback.success();
                }
            } else {
                if (callback.failure) {
                    callback.failure();
                }
            }
        });
    } else {
        E.fxTerminal(true, 10034, config, params);
    }
};


/**
 * ## 「标准」`Ux.asyncData`
 *
 * 异步读取专用函数
 *
 *  * ### config 格式
 *
 * ```json
 * {
 *     method: "get | post | put | fetch | push | delete",
 *     uri: "访问Ajax的路径信息",
 * }
 * ```
 *
 * ### callback 格式
 *
 * 回调函数，如果成功响应，则直接执行 callback 函数，将响应信息作为回调函数的参数。
 *
 * ### mock 格式
 *
 * > 该格式目前通常不使用，需要使用则直接传入 mock 完成。
 *
 * ```json
 * {
 *     mock: "true | false，是否开启mock",
 *     data: "{} Mock的核心数据格式",
 *     processor: "是否执行响应格式的处理专用"
 * }
 * ```
 *
 * @memberOf module:_ajax
 * @async
 * @param {Object} config 异步验证配置信息
 * @param {Object} params 核心参数信息，传入 Ajax 的数据信息
 * @param {Function} callback 回调函数结构，仅在成功时调用 callback，不执行失败处理
 * @param {JObject} mock 模拟数据格式信息
 */
const asyncData = (config = {}, params = {}, callback = () => {
}, mock = {}) => {
    const ajaxFn = ajaxFun[config.method ? config.method.toLowerCase() : 'get'];
    const uri = config.uri;
    if (uri && ajaxFn) {
        ajaxFn(uri, params, mock).then(data => {
            if (callback) {
                callback(data);
            }
        });
    } else {
        E.fxTerminal(true, 10034, config, params);
    }
};


/**
 * ## 「标准」`Ux.asyncPromise`
 *
 * 无回调函数的直接执行，该函数和`asyncData`类似，只是是非回调模式，而是直接返回 Promise。
 *
 *
 *  * ### config 格式
 *
 * ```json
 * {
 *     method: "get | post | put | fetch | push | delete",
 *     uri: "访问Ajax的路径信息",
 * }
 * ```
 *
 * ### mock 格式
 *
 * > 该格式目前通常不使用，需要使用则直接传入 mock 完成。
 *
 * ```json
 * {
 *     mock: "true | false，是否开启mock",
 *     data: "{} Mock的核心数据格式",
 *     processor: "是否执行响应格式的处理专用"
 * }
 * ```
 *
 * @async
 * @memberOf module:_ajax
 * @param {Object} config 异步验证配置信息
 * @param {Object} params 核心参数信息，传入 Ajax 的数据信息
 * @param {JObject} mock 模拟数据格式信息
 * @return {Promise<T>} 返回异步构造好的 Promise
 */
const asyncPromise = (config = {}, params = {}, mock = {}) => {
    const ajaxFn = ajaxFun[config.method ? config.method.toLowerCase() : 'get'];
    const uri = config.uri;
    if (uri && ajaxFn) {
        return ajaxFn(uri, params, mock);
    } else {
        E.fxTerminal(true, 10034, config, params);
    }
};


/**
 * ## 「标准」`Ux.rxEdict`
 *
 * 基于 Observable 的 Redux 函数，和 Ajax 相关的响应式函数，框架内的使用代码如下：
 *
 * ```js
 * export default {
 *     // 读取 tabular 的专用 redux 类型的响应式 Ajax 处理
 *     epicTabular: Ux.rxEdict(Types.epicTabular, I.tabular, data => Ux.rxDatum(data))
 * }
 * ```
 *
 * EmptyActionCreator 的原始创建代码如下：
 *
 * ```js
 * import createAction from 'redux-act';
 * const action = createAction("REDUX//ACTION//NAME");
 * ```
 *
 * @memberOf module:_ajax
 * @async
 * @param {EmptyActionCreator} type 创建好的 Redux 中的 Action，和 `redux-act` 绑定
 * @param {Promise<T>} promise 构造的Ajax类型的异步Promise
 * @param {Function} responser 响应处理器，默认使用 `data => data` 不执行任何处理，需要转换则直接执行转换。
 * @return {any} 返回 redux 和 rxjs 中的核心监听对象，用于执行最终输出
 */
const rxEdict = (type, promise, responser = data => data) => {
    if (type && Abs.isFunction(promise)) {
        return $action => {
            const actionType = $action.ofType(type.getType());
            const source = from(actionType);
            return source.pipe(
                map(action => action.payload),
                map(promise),
                switchMap(promise => from(promise).pipe(
                    map(responser),
                    map(E.fxRedux),
                    map(data => Rx.dataOut(data))
                ))
            );
        };
    } else {
        E.fxTerminal(true, 10027, type, promise);
    }
};
export default {
    rxEdict,
    // 不更改Ajax部分
    ...Ajax,
    // 特殊
    ajaxEager,

    // 异步处理
    asyncTrue,
    asyncData,
    asyncPromise,
    // 回调
    ajaxError,
    ajaxDialog,
    ajaxMessage,

    ajax2Dialog,    // 2阶
    ajax2Message,   // 2阶
    ajax2True,      // 2阶
    // message.js
    messageSuccess,
    messageFailure,
    messageCatch
}