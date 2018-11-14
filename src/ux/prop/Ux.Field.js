import Ajax from '../ajax/Ux.Ajax';
import E from '../Ux.Error';

const ajaxFun = {
    get: Ajax.ajaxGet,
    post: Ajax.ajaxPost,
    fetch: Ajax.ajaxFetch,
    push: Ajax.ajaxPush,
    delete: Ajax.ajaxDelete
};

/**
 * 二义性验证专用异步验证函数，返回值为true或false
 * @method asyncTrue
 * @param config 异步验证配置信息
 * @param params 传入参数信息
 * @param callback 异步验证完成后的回调对象，success为true回调，failure为false回调
 * @param mock 【Mock模式可用】
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
 * 异步验证专用函数，返回值为Object
 * @method asyncData
 * @param config 异步验证配置信息
 * @param params 传入参数信息
 * @param callback 异步验证完成后的回调函数
 * @param mock 【Mock模式可用】
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
const asyncPromise = (config = {}, params = {}, mock = {}) => {
    const ajaxFn = ajaxFun[config.method ? config.method.toLowerCase() : 'get'];
    const uri = config.uri;
    if (uri && ajaxFn) {
        return ajaxFn(uri, params, mock);
    } else {
        E.fxTerminal(true, 10034, config, params);
    }
};
/**
 * @class Field
 * @description 字段异步验证专用类
 */
export default {
    asyncTrue,
    asyncData,
    asyncPromise,
};
