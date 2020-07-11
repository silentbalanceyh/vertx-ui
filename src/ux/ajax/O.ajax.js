import Cv from "../constant";
import Aid from './I.before';
import Resp from './I.response';
import Abs from '../abyss';

/**
 * ## 标准私有函数「2阶」
 *
 * Http读取资源的核心函数，分为两种模式
 *
 * 1. secure = false：非安全模式的信息读取
 * 2. secure = true：安全模式的信息读取
 *
 * 读取的最终结果为`Function`得到最终函数信息，该二阶函数是统一资源读取函数，生成的函数执行最终的Ajax请求处理，这个方法只会
 * 被内部调用，在上层调用时会被直接分流。
 *
 * > 这种模式只处理当前站点的 uri 路径，不结合 ENDPOINT 的路径执行远程请求
 *
 * @memberOf module:__private
 * @param {String} method HTTP方法，可支持的 Http 相关方法
 * @param {boolean} secure 是否安全模式的读取
 * @return {function(*=, *=, *=): Promise<T>} 最终的 Promise 生成器
 */
const ajaxRead = (method = "get", secure = false) => (uri, params = {}, options) => {
    const $params = Abs.clone(params);
    const api = Aid.ajaxUri(uri, method, params);
    const headers = Aid.ajaxHeaderJ(secure, options);
    const request = new Request(api, Aid.ajaxOptions(method, headers, options));
    return Resp.ajaxResponse(request, $params);
};

/**
 *
 * ## 标准私有函数「2阶」
 *
 * Http写资源的核心函数，分为两种模式
 *
 * 1. secure = false：非安全模式的信息读取
 * 2. secure = true：安全模式的信息读取
 *
 * 这种模式下会处理更多的 Http 请求体部分的内容
 *
 * > 这种模式只处理当前站点的 uri 路径，不结合 ENDPOINT 的路径执行远程请求
 *
 * @memberOf module:__private
 * @param {String} method HTTP方法，可支持的 Http 相关方法
 * @param {boolean} secure 是否安全模式的读取
 * @return {function(*=, *=, *=): Promise<T>} 最终的 Promise 生成器
 */
const ajaxFull = (method = "post", secure = false) => (uri, params = {}, options = {}) => {
    const $params = Abs.clone(params);
    const api = Aid.ajaxUri(uri, method, params);
    const headers = Aid.ajaxHeaderJ(secure, options);
    const request = new Request(api, {
        ...Aid.ajaxOptions(method, headers, options),
        body: Aid.ajaxParams(params, options)
    });
    return Resp.ajaxResponse(request, $params);
};
/**
 * ## 标准私有函数「2阶」
 *
 * Http写资源的核心函数，分为两种模式
 *
 * 1. secure = false：非安全模式的信息读取
 * 2. secure = true：安全模式的信息读取
 *
 * 这种模式下会处理更多的 Http 请求体部分的内容，并且结合 ENDPOINT 计算远程路径，SOA标准调用的 Ajax 函数，执行写入
 *
 * @memberOf module:__private
 * @param {String} method HTTP方法，可支持的 Http 相关方法
 * @param {boolean} secure 是否安全模式的读取
 * @return {function(*, *=, *=): Promise<T>} 最终的 Promise 生成器
 */
const ajaxWrite = (method = "post", secure = false) => (uri, params = {}, options = {}) => {
    const $params = Abs.clone(params);
    const api = `${Cv['ENDPOINT']}${uri}`;
    const headers = Aid.ajaxHeaderJ(secure, options);
    const request = new Request(api, {
        ...Aid.ajaxOptions(method, headers, options),
        body: Aid.ajaxParams(params, options)
    });
    return Resp.ajaxResponse(request, $params);
};
/**
 * ## 标准函数
 *
 * **非安全方法**，直接从当前站点读取资源相关信息
 *
 * > 这种模式只处理当前站点的 uri 路径，不结合 ENDPOINT 的路径执行远程请求
 *
 * @memberOf module:_ajax
 * @method [P] ajaxResource
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
 * ## 标准函数
 *
 * **安全方法**，上传专用的 Ajax 函数，文件上传专用的 Ajax 函数。
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
    Aid.ajaxHeader(headers, true);
    const request = new Request(api, {
        ...Aid.ajaxOptions("POST", headers, options),
        body: fileData
    });
    return Resp.ajaxResponse(request, fileData);
};

const _ajaxDown = (uri, params, options = {}, method = "GET") => {
    const api = Aid.ajaxUri(uri, method, params);
    const headers = new Headers();
    Aid.ajaxHeader(headers, true);
    // 下载专用头设置，客户端只接受 octet-stream 格式
    headers.append(Cv.HTTP11.ACCEPT, "application/octet-stream");
    headers.append(Cv.HTTP11.CONTENT_TYPE, "application/octet-stream");
    // Download专用
    const request = new Request(api, {
        ...Aid.ajaxOptions(method, headers, options),
        // 解决无法传参的问题
        body: JSON.stringify(params)
    });
    return Resp.ajaxBlob(request, params);
};
/**
 * ## 标准函数
 *
 * **安全方法**，`GET`下载专用方法，下载内容会返回二进制数据
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
 * ## 标准函数
 *
 * **安全方法**， `POST`下载专用方法，下载内容会返回二进制数据
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

export default {
    ajaxResource,
    ajaxUpload,     // 上传
    ajaxPull,       // 下载（POST）
    ajaxDownload,   // 下载（GET）
    /**
     * ## 标准函数
     *
     * **非安全方法**，GET开放性方法
     *
     * @method [P] ajaxFetch
     * @async
     * @memberOf module:_ajax
     * @param {String} uri 远程开放的Api接口路径
     * @param {Object} params 调用接口专用参数
     * @param {Object} options Http请求头相关信息
     * @return {Promise<T>} 返回调用接口的 Promise
     */
    ajaxFetch: (uri, params = {}, options) =>
        ajaxRead(Cv.HTTP_METHOD.GET)(uri, params, options),
    /**
     * ## 标准函数
     *
     * **非安全方法**，GET开放性方法
     *
     * @method [P] microFetch
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
     * ## 标准函数
     *
     * **非安全方法**，POST开放性方法
     *
     * @method [P] ajaxPush
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
     * ## 标准函数
     *
     * **非安全方法**，POST开放性方法
     *
     * @method [P] microPush
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
     * ## 标准函数
     *
     * **安全方法**，GET开放性方法
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
     * ## 标准函数
     *
     * **安全方法**，GET开放性方法
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
     * ## 标准函数
     *
     * **安全方法**，POST开放性方法
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
     * ## 标准函数
     *
     * **安全方法**，POST开放性方法
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
     * ## 标准函数
     *
     * **安全方法**，PUT开放性方法
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
     * ## 标准函数
     *
     * **安全方法**，PUT开放性方法
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
     * ## 标准函数
     *
     * **安全方法**，DELETE开放性方法
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
     * ## 标准函数
     *
     * **安全方法**，DELETE开放性方法
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
