import Cv from "../constant";
import Aid from './I.before';
import Resp from './I.response';
import Abs from '../abyss';

/**
 * 【高阶函数：二阶】Ajax统一调用的读取方法，生成统一的Ajax远程读取方法
 * @method ajaxRead
 * @private
 * @param method HTTP方法
 * @param secure 是否安全模式
 */
const ajaxRead = (method = "get", secure = false) => (uri, params = {}, options) => {
    const $params = Abs.clone(params);
    const api = Aid.ajaxUri(uri, method, params);
    const headers = Aid.ajaxHeader(secure);
    const request = new Request(api, Aid.ajaxOptions(method, headers, options));
    return Resp.ajaxResponse(request, $params);
};

/**
 * 【高阶函数：二阶】Ajax统一调用的读写双用方法，生成统一的Ajax远程调用方法，ajaxRead + ajaxWrite方法
 * @method ajaxFull
 * @private
 * @param method HTTP方法
 * @param secure 是否安全模式
 */
const ajaxFull = (method = "post", secure = false) => (uri, params = {}, options = {}) => {
    const $params = Abs.clone(params);
    const api = Aid.ajaxUri(uri, method, params);
    const headers = Aid.ajaxHeader(secure);
    const request = new Request(api, {
        ...Aid.ajaxOptions(method, headers, options),
        body: Aid.ajaxParams(params)
    });
    return Resp.ajaxResponse(request, $params);
};

/**
 * 【高阶函数：二阶】Ajax统一调用的读取方法，生成统一的Ajax远程写数据方法
 * @method ajaxWrite
 * @private
 * @param method HTTP方法
 * @param secure 是否安全模式
 */
const ajaxWrite = (method = "post", secure = false) => (uri, params = {}, options = {}) => {
    const $params = Abs.clone(params);
    const api = `${Cv['ENDPOINT']}${uri}`;
    const headers = Aid.ajaxHeader(secure);
    const request = new Request(api, {
        ...Aid.ajaxOptions(method, headers, options),
        body: Aid.ajaxParams(params)
    });
    return Resp.ajaxResponse(request, $params);
};
/**
 * 上传专用方法
 * @param uri
 * @param file
 * @param options
 * @returns {Promise<Response>}
 */
const ajaxUpload = (uri, file, options = {}) => {
    // 构造MultiPart
    const fileData = new FormData();
    fileData.append('file', file);
    // 构造Api和参数
    const api = `${Cv['ENDPOINT']}${uri}`;
    const headers = new Headers();
    Aid.ajaxSecure(headers, true);
    const request = new Request(api, {
        ...Aid.ajaxOptions("POST", headers, options),
        body: fileData
    });
    return Resp.ajaxResponse(request, fileData);
};

const _ajaxDown = (uri, params, options = {}, method = "GET") => {
    const api = Aid.ajaxUri(uri, method, params);
    const headers = new Headers();
    Aid.ajaxSecure(headers, true);
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

const ajaxDownload = (uri, params, options) => _ajaxDown(uri, params, options);

const ajaxPull = (uri, params, options) => _ajaxDown(uri, params, options, "POST");
/**
 * 构造微服务路径专用
 * @param serviceName 服务名称
 * @param uri 服务专用URI
 */
const _buildApi = (serviceName = "", uri = "") => `/${serviceName}${uri}`.replace(/\/\//g, "/");

const ajaxResource = (uri) => {
    const request = new Request(uri, {
        method: "get"
    });
    return fetch(request).then(data => Abs.promise(data.text()));
};
/**
 * @class Ajax
 * @description 远程Ajax访问专用API方法
 */
export default {
    ajaxResource,
    ajaxUpload,     // 上传
    ajaxDownload,   // 下载（GET）
    ajaxPull,       // 下载（POST）
    /**
     * secure = false，非安全模式的读取方法，HttpMethod = GET，底层调ajaxRead
     * @method ajaxFetch
     * @param uri 该Ajax调用的Uri路径
     * @param params 请求参数
     * @param options
     */
    ajaxFetch: (uri, params = {}, options) =>
        ajaxRead(Cv.HTTP_METHOD.GET)(uri, params, options),
    microFetch: (service, uri, params = {}, options) =>
        ajaxRead(Cv.HTTP_METHOD.GET)(_buildApi(service, uri), params, options),
    /**
     * secure = false，非安全模式的写方法，HttpMethod = POST，底层调ajaxWrite
     * @method ajaxPush
     * @param uri 该Ajax调用的Uri路径
     * @param params 请求参数
     * @param options
     */
    ajaxPush: (uri, params = {}, options) =>
        ajaxWrite(Cv.HTTP_METHOD.POST)(uri, params, options),
    microPush: (service, uri, params, options) =>
        ajaxWrite(Cv.HTTP_METHOD.POST)(_buildApi(service, uri), params, options),
    /**
     * secure = true，安全模式的读取方法，HttpMethod = GET，底层调ajaxRead
     * @method ajaxGet
     * @param uri 该Ajax调用的Uri路径
     * @param params 请求参数
     * @param options
     */
    ajaxGet: (uri, params = {}, options) =>
        ajaxRead(Cv.HTTP_METHOD.GET, true)(uri, params, options),
    microGet: (service, uri, params, options) =>
        ajaxRead(Cv.HTTP_METHOD.GET, true)(_buildApi(service, uri), params, options),
    /**
     * secure = true，安全模式的写方法，HttpMethod = POST，底层调ajaxFull
     * @method ajaxPost
     * @param uri 该Ajax调用的Uri路径
     * @param params 请求参数
     * @param options
     */
    ajaxPost: (uri, params = {}, options) =>
        ajaxFull(Cv.HTTP_METHOD.POST, true)(uri, params, options),
    microPost: (service, uri, params, options) =>
        ajaxFull(Cv.HTTP_METHOD.POST, true)(_buildApi(service, uri), params, options),
    /**
     * secure = true，安全模式的写方法，HttpMethod = PUT，底层调ajaxFull
     * @method ajaxPut
     * @param uri 该Ajax调用的Uri路径
     * @param params 请求参数
     * @param options
     */
    ajaxPut: (uri, params = {}, options) =>
        ajaxFull(Cv.HTTP_METHOD.PUT, true)(uri, params, options),
    microPut: (service, uri, params, options) =>
        ajaxFull(Cv.HTTP_METHOD.PUT, true)(_buildApi(service, uri), params, options),
    /**
     * secure = true，安全模式的写方法，HttpMethod = DELETE，底层调ajaxFull
     * @method ajaxDelete
     * @param uri 该Ajax调用的Uri路径
     * @param params 请求参数
     * @param options
     */
    ajaxDelete: (uri, params = {}, options) =>
        ajaxFull(Cv.HTTP_METHOD.DELETE, true)(uri, params, options),
    microDelete: (service, uri, params, options) =>
        ajaxFull(Cv.HTTP_METHOD.DELETE, true)(_buildApi(service, uri), params, options),
};
