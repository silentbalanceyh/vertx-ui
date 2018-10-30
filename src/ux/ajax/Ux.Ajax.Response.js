import Cv from "../cv/Ux.Constant";
import Aid from "./Ux.Ajax.Aid";
import Dg from "../Ux.Debug";
import Log from "../monitor/Mt.Logger";

const _ajaxExtract = (request, params, body, response) => {
    // Body的打印处理
    if (Cv["DEBUG_AJAX"]) Dg.dgFileJson({
        request: params,
        response: body
    });
    Log.response(body, params, request);
    // 最终的返回处理
    if (response.ok) {
        return body;
    } else {
        Dg.dgAjax(body, "Remote Error:");
        return Promise.reject({data: body});
    }
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
    }
};

const ajaxBlob = async (request, mockData = {}, params) => {
    if (Cv.MOCK && mockData.mock) {
        return Promise.resolve(mockData.processor ? mockData.processor(mockData.data, params) : mockData.data);
    } else {
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
    }
};

export default {
    ajaxResponse,
    ajaxBlob
};