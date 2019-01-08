import Cv from "../cv/Ux.Constant";
import RxAjax from './Ux.Ajax.Rx';
import U from 'underscore';
import Aid from './Ux.Ajax.Aid';
import Resp from './Ux.Ajax.Response';
import Log from './Ux.Ajax.Log';
import Value from '../Ux.Value';

/**
 * 【高阶函数：二阶】Ajax统一调用的读取方法，生成统一的Ajax远程读取方法
 * @method ajaxRead
 * @private
 * @param method HTTP方法
 * @param secure 是否安全模式
 */
const ajaxRead = (method = "get", secure = false) => (uri, params = {}, mockData) => {
    const $params = Value.clone(params);
    const api = Aid.ajaxUri(uri, method, params);
    Log.ajaxLog(api, method, params, mockData);
    const headers = Aid.ajaxHeader(secure);
    const request = new Request(api, Aid.ajaxOptions(method, headers));
    return Resp.ajaxResponse(request, mockData, $params);
};

const ajaxResource = (uri) => {
    const request = new Request(uri, {
        method: "get"
    });
    return fetch(request).then(data => Promise.resolve(data.text()));
};
/**
 * 【高阶函数：二阶】Ajax统一调用的读写双用方法，生成统一的Ajax远程调用方法，ajaxRead + ajaxWrite方法
 * @method ajaxFull
 * @private
 * @param method HTTP方法
 * @param secure 是否安全模式
 */
const ajaxFull = (method = "post", secure = false) => (uri, params = {}, mockData) => {
    const $params = Value.clone(params);
    const api = Aid.ajaxUri(uri, method, params);
    Log.ajaxLog(api, method, params, mockData);
    const headers = Aid.ajaxHeader(secure);
    const request = new Request(api, {
        ...Aid.ajaxOptions(method, headers),
        body: Aid.ajaxParams(params)
    });
    return Resp.ajaxResponse(request, mockData, $params);
};

/**
 * 【高阶函数：二阶】Ajax统一调用的读取方法，生成统一的Ajax远程写数据方法
 * @method ajaxWrite
 * @private
 * @param method HTTP方法
 * @param secure 是否安全模式
 */
const ajaxWrite = (method = "post", secure = false) => (uri, params = {}, mockData, options = {}) => {
    const $params = Value.clone(params);
    const api = `${Cv['ENDPOINT']}${uri}`;
    Log.ajaxLog(api, method, params, mockData);
    const headers = Aid.ajaxHeader(secure, options);
    const request = new Request(api, {
        ...Aid.ajaxOptions(method, headers),
        body: Aid.ajaxParams(params)
    });
    return Resp.ajaxResponse(request, mockData, $params);
};
/**
 * 上传专用方法
 * @param uri
 * @param file
 * @param mockData
 * @returns {Promise<Response>}
 */
const ajaxUpload = (uri, file, mockData) => {
    // 构造MultiPart
    const fileData = new FormData();
    fileData.append('file', file);
    // 构造Api和参数
    const api = `${Cv['ENDPOINT']}${uri}`;
    Log.ajaxLog(api, "POST", fileData, mockData);
    const headers = new Headers();
    Aid.ajaxSecure(headers, true);
    const request = new Request(api, {
        ...Aid.ajaxOptions("POST", headers),
        body: fileData
    });
    return Resp.ajaxResponse(request, mockData, fileData);
};

const ajaxDownload = (uri, params, mockData) => {
    const api = Aid.ajaxUri(uri, "GET", params);
    Log.ajaxLog(api, "GET", {}, mockData);
    const headers = new Headers();
    Aid.ajaxSecure(headers, true);
    // 下载专用头设置，客户端只接受 octet-stream 格式
    headers.append(Cv.HTTP11.ACCEPT, "application/octet-stream");
    headers.append(Cv.HTTP11.CONTENT_TYPE, "application/octet-stream");
    // Download专用
    const request = new Request(api, {
        ...Aid.ajaxOptions("GET", headers)
    });
    return Resp.ajaxBlob(request, mockData, {});
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
            });
        } else {
            // 不返回promise，直接返回值
            loading();
            return resolve({
                data: retSuccess,
                success: true
            });
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
    // 上传
    ajaxUpload,
    // 下载
    ajaxDownload,
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
