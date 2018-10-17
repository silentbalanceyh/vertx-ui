import Cv from "../Ux.Constant";
import Aid from "./Ux.Ajax.Aid";
import Dg from "../Ux.Debug";
import Log from "../monitor/Mt.Logger";


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
        body = Aid.ajaxAdapter(body);
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

const ajaxBlob = async (request, mockData = {}, params) => {
    if (Cv.MOCK && mockData.mock) {
        return Promise.resolve(mockData.processor ? mockData.processor(mockData.data, params) : mockData.data);
    } else {
        const response = await fetch(request);
        let body = await response.blob();
        // 任何时候都需要调用适配器，包括errors
        if (!response.ok) {
            body = {
                stream: body,
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

export default {
    ajaxResponse,
    ajaxBlob
};