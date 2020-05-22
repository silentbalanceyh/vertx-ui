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
/**
 * ## 私有函数
 *
 * Ajax的 Mock专用接口，用于模拟 Mock 数据所需的模拟数据接口，模拟数据位于：`src/mock` 中。
 * 调用时可直接使用：
 *
 * ```js
 * import Mock from 'mock';
 * ```
 *
 * mock数据格式如下：
 *
 * ```json
 * {
 *     "mock": true,
 *     "data": "...数据格式",
 *     "processor": "内部数据处理函数，可自定义逻辑"
 * }
 * ```
 *
 *
 * | 字段 | 说明 |
 * |:---|:---|
 * | mock | true 开启Mock，必须在环境变量开启模拟数据时生效，false则直接关闭mock |
 * | data | 对象或数组，Object或Array格式 |
 * | processor | 函数，参数参考下边函数参数 |
 *
 *
 * ## 参数函数
 *
 * ### processor
 *
 * | 参数名 | 类型 | 说明 |
 * |:--- |:---|:---|
 * | source | any | 输入的参数核心信息 |
 * | params | any | 请求的格式相关数据 |
 *
 * @memberOf module:__private
 * @async
 * @method ajaxMock
 * @param {Request} request 请求基本信息
 * @param {Object} params 请求参数相关信息
 * @param {Function} executor 最终 Promise<T> 的执行器
 * @return {Promise<T>} 模拟数据后的最终数据处理。
 */
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
                /* Mock日志 */
                Log.mock(params, mockData.data, method + " " + api);
                let response = {};
                if (U.isFunction(mockData.processor)) {
                    /* 带 processor 流程 */
                    const source = Abs.clone(mockData.data);
                    let called = mockData.processor(source, Abs.clone(params));
                    if (called instanceof Promise) {
                        const [error, data] = await Abs.promise(called);
                        called = {}
                        if (data) {
                            called = data;
                        } else {
                            called = {
                                data: error,
                                _error: true
                            }
                        }
                    }
                    Dev.Logger.response(called, params, request, true);
                    response = await Abs.promise(called);
                } else {
                    /*
                     * 不带 processor 的 mock 流程
                     */
                    Dev.Logger.response(mockData.data, params, request, true);
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