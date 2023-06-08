import __AJX from './lighting.fn.ajax.standard';
import __ANT from './antd4.fn.message.reply';
import __Zn from './zero.module.dependency';

const V_ASYNC_FN = {
    get: __AJX.ajaxGet,
    post: __AJX.ajaxPost,
    put: __AJX.ajaxPut,
    fetch: __AJX.ajaxFetch,
    push: __AJX.ajaxPush,
    delete: __AJX.ajaxDelete
};
const asyncData = (config = {}, params = {}, callback = () => {
}, mock = {}) => {
    const ajaxFn = V_ASYNC_FN[config.method ? config.method.toLowerCase() : 'get'];
    const uri = config.uri;
    if (uri && ajaxFn) {
        ajaxFn(uri, params, mock).then(data => {
            if (callback) {
                callback(data);
            }
        });
    } else {
        __Zn.fxTerminal(true, 10034, config, params);
    }
};
const asyncTrue = (config = {}, params = {}, callback = {}, mock = {}) => {
    const ajaxFn = V_ASYNC_FN[config.method ? config.method.toLowerCase() : 'get'];
    const uri = config.uri;
    if (uri && ajaxFn) {
        return ajaxFn(uri, params, mock).then(data => {
            if (true === data) {
                if (callback.success) {
                    return callback.success();
                }
            } else {
                if (callback.failure) {
                    return callback.failure();
                }
            }
            return Promise.resolve(data);
        });
    } else {
        __Zn.fxTerminal(true, 10034, config, params);
        return __Zn.fxReject(10034);
    }
};
const asyncPromise = (config = {}, params = {}, mock = {}) => {
    const ajaxFn = V_ASYNC_FN[config.method ? config.method.toLowerCase() : 'get'];
    const uri = config.uri;
    if (uri && ajaxFn) {
        return ajaxFn(uri, params, mock);
    } else {
        __Zn.fxTerminal(true, 10034, config, params);
    }
};
const asyncImage = (item = {}, blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(blob);
    reader.addEventListener("load", () => {
        const type = item.type ? item.type : "image/jpeg";
        const blob = new Blob([reader.result], {type});
        // Secondary
        const innerReader = new FileReader();
        innerReader.readAsDataURL(blob);
        innerReader.addEventListener("load", () => {
            if (0 < blob.size) {
                item.thumbUrl = innerReader.result;
            }
            resolve(item);
        });
    });
});
const asyncWrap = (reference, message = {}, runnerFn) => {
    return new Promise((resolve, reject) => {
        try {
            runnerFn().then(response => {
                if (message.success) {
                    __ANT.messageSuccess(message.success);
                }
                resolve(response);
            });
        } catch (error) {
            console.error("出现了非法 Promise，请传入合法 Promise：runnerFn");
            reject({error});
        }
    }).catch(ex => {
        console.error(ex);
        const {failure = "Ajax执行出错，runnerFn不是合法Promise！"} = message;
        __ANT.messageFailure(failure, 3);
    });
}
export default {
    V_ASYNC_FN,
    asyncTrue,
    asyncData,
    asyncPromise,
    asyncImage,
    asyncWrap,
}