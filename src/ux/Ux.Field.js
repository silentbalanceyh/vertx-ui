import Ajax from './Ux.Ajax';

const ajaxFun = {
    get : Ajax.ajaxGet,
    post : Ajax.ajaxPost,
    delete : Ajax.ajaxDelete
};

const asyncTrue = (config = {}, params = {}, callback = {}) => {
    const ajaxFn = ajaxFun[config.method ? config.method.toLowerCase() : 'get'];
    const uri = config.uri;
    if (uri && ajaxFn) {
        const promise = ajaxFn(uri, params);
        promise.then(data => {
            if (data) {
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
        console.error("[V] Async error happened.", config, params);
    }
};

const asyncData = (config = {}, params = {}, callback = () => {
}, mock = {}) => {
    const ajaxFn = ajaxFun[config.method ? config.method.toLowerCase() : 'get'];
    const uri = config.uri;
    if (uri && ajaxFn) {
        const promise = ajaxFn(uri, params, mock);
        promise.then(data => {
            if (callback) {
                callback(data);
            }
        });
    } else {
        console.error("[V] Async error happened.", config, params);
    }
};
export default {
    asyncTrue,
    asyncData
}
