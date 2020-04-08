import Ajax from './O.ajax';
import E from '../error';

const ajaxFun = {
    get: Ajax.ajaxGet,
    post: Ajax.ajaxPost,
    put: Ajax.ajaxPut,
    fetch: Ajax.ajaxFetch,
    push: Ajax.ajaxPush,
    delete: Ajax.ajaxDelete
};
/**
 * ## 标准函数
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
 * @memberOf module:_callback
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
 * ## 标准函数
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
 * @memberOf module:_callback
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
 * ## 标准函数「Monad」
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
 * @memberOf module:_callback
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
export default {
    asyncTrue,
    asyncData,
    asyncPromise,
};
