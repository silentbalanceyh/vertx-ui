import Mock from "mock";
import Logger from './tracer.c.logger';
import __SEC from './secure.fn.digit.signature';

import __Zn from './zero.module.dependency';

const Cv = __Zn.Env;

const __mockKey = (request, params) => {
    let api = request.url;
    // 去掉 FormData 类型的数据
    if (!FormData.prototype.isPrototypeOf(params)) {
        __Zn.itObject(params, (k, v) => {
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

const __mockAjax = async (request = {}, params = {}, executor = {}) => {
    /*
     * 同时开启了 DEBUG 和 MOCK
     */
    const api = request.url;
    const method = request.method;
    const fnExecute = async () => {
        Logger.request(request, params, __SEC.digitToken());
        return await executor();
    };
    if (Cv.MOCK && Cv.DEBUG) {
        const mockKey = __mockKey(request, params);
        /*
         * 检查是否开启了mock
         */
        __Zn.dgDebug({mockKey}, "当前请求的 mock key", "#545454");
        if (Mock[mockKey]) {
            const mockData = Mock[mockKey];
            if (mockData.mock) {
                /* Mock日志 */
                Logger.mock(params, mockData.data, method + " " + api);
                let response = {};
                if (__Zn.isFunction(mockData.processor)) {
                    /* 带 processor 流程 */
                    const source = __Zn.clone(mockData.data);
                    let called = mockData.processor(source, __Zn.clone(params));
                    if (called instanceof Promise) {
                        let ok = await called;
                        if (ok['_error']) {
                            ok = __Zn.clone(ok);
                            called = {
                                data: ok,
                                _error: ok['_error']
                            }
                        } else {
                            called = ok;
                        }
                    }
                    await Logger.response(called, params, request, true);
                    response = await __Zn.promise(called);
                } else {
                    /*
                     * 不带 processor 的 mock 流程
                     */
                    await Logger.response(mockData.data, params, request, true);
                    response = await __Zn.promise(mockData.data);
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

const __replyAdapter = (body = {}) => {
    /*
     * body 中的数据结构用于处理直接 body 的内容
     * 带有 data，zero 规范中的内容
     */
    if (body.data) {
        const {
            data,        // 数据部分
            meta,        // 元数据配置
            extension,   // 扩展配置
            plugin,      // 插件配置

            __acl,         // ACL 权限控制
            __qr,          // 查询条件节点
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
        Object.assign(data, __Zn.valueValid({
            __acl,
            __qr,

            __meta: meta,
            __extension: extension,
            __plugin: plugin
        }))
        return data;
    } else return body;
};
const __replyWrap = (request, params, body, response) => {
    // Body的打印处理
    Logger.response(body, params, request);
    // 最终的返回处理
    if (response.ok) {
        return Promise.resolve(body, "config");
    } else {
        __Zn.dgAjax(body, "Remote Error:");
        return Promise.reject({data: body});
    }
};
const replyData = async (request, params) => __mockAjax(request, params, async () => {
    const response = await fetch(request);
    let body;
    if (response.ok) {
        if (200 === response.status) {
            body = await response.json();
            // 任何时候都需要调用适配器，包括errors
            body = __replyAdapter(body);
        } else if (204 === response.status) {
            // null
            body = {};
        }
    } else {
        let json = null;
        try {
            json = await response.json();
            // 任何时候都需要调用适配器，包括errors
            json = __replyAdapter(json);
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
    return __replyWrap(request, params, body, response);
})
const replyBlob = async (request, params = {}) => __mockAjax(request, params, async () => {
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
    return __replyWrap(request, params, body, response);
});
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    replyData,
    replyBlob,
}