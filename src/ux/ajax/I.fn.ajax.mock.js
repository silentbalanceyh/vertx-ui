import Cv from "../constant";
import Abs from '../abyss';
import Mock from 'mock';
import Dev from "../develop";
import U from 'underscore';
import Log from "../develop/logger";
import Ut from "../unity";

const calculateKey = (request) => {
    const api = request.url;
    const method = request.method;
    const regex = new RegExp(Cv['ENDPOINT'], "g");
    let path = api.replace(regex, "").replace(/\//g, '_');
    if (0 < path.indexOf("?")) {
        path = path.split('?')[0];
    }
    const requestMethod = method.toLowerCase();
    return `${requestMethod}${path}`;
};

export default async (request = {}, params = {}, executor = {}) => {
    /*
     * 同时开启了 DEBUG 和 MOCK
     */
    const api = request.url;
    const method = request.method;
    const fnExecute = async () => {
        Log.request(request, params, Ut.token());
        return await executor();
    };
    if (Cv.MOCK && Cv.DEBUG) {
        const mockKey = calculateKey(request);
        /*
         * 检查是否开启了mock
         */
        Dev.dgDebug({mockKey}, "当前请求的 mock key", "#545454");
        if (Mock[mockKey]) {
            const mockData = Mock[mockKey];
            if (mockData.mock) {
                Log.mock(params, mockData.data, method + " " + api);
                let response = {};
                if (U.isFunction(mockData.processor)) {
                    /*
                     * 带 processor 的 mock 流程
                     */
                    const source = Abs.clone(mockData.data);
                    const result = mockData.processor(source, Abs.clone(params));
                    Dev.Logger.response(result, params, request, true);
                    response = await Abs.promise(result);
                } else {
                    /*
                     * 不带 processor 的 mock 流程
                     */
                    Dev.Logger.response(mockData.data, params, request, true);
                    response = await Abs.promise(mockData.data);
                }
                if (response.continue) {
                    return await fnExecute();
                } else {
                    return response;
                }
            } else {
                return await fnExecute();
            }
        } else {
            return await fnExecute();
        }
    } else {
        return await fnExecute();
    }
}