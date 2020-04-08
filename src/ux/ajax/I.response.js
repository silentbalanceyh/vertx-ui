import Aid from "./I.before";
import mockAjax from './I.fn.ajax.mock';
import Dev from '../develop';

/* 纯私有函数，不提供文档 */
const _ajaxExtract = (request, params, body, response) => {
    // Body的打印处理
    Dev.Logger.response(body, params, request);
    // 最终的返回处理
    if (response.ok) {
        return body;
    } else {
        Dev.dgAjax(body, "Remote Error:");
        return Promise.reject({data: body});
    }
};
/**
 * ## 私有函数
 *
 * ES7 语法中的响应处理函数，字符流响应处理器
 *
 * @memberOf module:__private
 * @param {Request} request fetch库中需要使用的Http请求对象
 * @param {Object} params 请求参数
 * @return {Promise<T>} 最终返回的 Promise 核心信息
 */
const ajaxResponse = async (request, params) => mockAjax(request, params,
    async () => {
        const response = await fetch(request);

        let body = {};
        if (response.ok) {
            body = await response.json();
            // 任何时候都需要调用适配器，包括errors
            body = Aid.ajaxAdapter(body);
        } else {
            let json = null;
            try {
                json = await response.json();
                // 任何时候都需要调用适配器，包括errors
                json = Aid.ajaxAdapter(json);
            } catch (error) {
                json = {data: error.toString()};
            }
            body = {
                ...json,
                status: response.status,
                statusText: response.statusText
            };
        }
        return _ajaxExtract(request, params, body, response);
    });

/**
 * ## 私有函数
 *
 * ES7 语法中的响应处理函数，字节流的响应处理器，主要用于 Blob 处理
 *
 * @memberOf module:__private
 * @param {Request} request fetch库中需要使用的Http请求对象
 * @param {Object} params 请求参数
 * @return {Promise<T>} 最终返回的 Promise 核心信息
 */
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
export default {
    ajaxResponse,
    ajaxBlob
};