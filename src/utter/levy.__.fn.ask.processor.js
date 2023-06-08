import Ux from 'ux';

const API_SECURE = {};
API_SECURE[Ux.Env.HTTP_METHOD.GET] = Ux.ajaxGet;       // get ->
API_SECURE[Ux.Env.HTTP_METHOD.POST] = Ux.ajaxPost;     // post ->
API_SECURE[Ux.Env.HTTP_METHOD.PUT] = Ux.ajaxPut;       // put ->
API_SECURE[Ux.Env.HTTP_METHOD.DELETE] = Ux.ajaxDelete; // delete ->

const API_PUB = {}
API_PUB[Ux.Env.HTTP_METHOD.GET] = Ux.ajaxFetch;        // get ->
API_PUB[Ux.Env.HTTP_METHOD.POST] = Ux.ajaxPush;        // post ->
const askRapid = (runner = {}, ...args) => askWith.apply(this, [runner, null].concat(args));
const askWith = (runner = {}, options, ...args) => {
    // URI extracting / Method extraction
    const {
        uri,
        method = Ux.Env.HTTP_METHOD.GET,
        outData = response => Ux.promise(response),
        outFail,
    } = runner;
    if (!Ux.isFunction(runner.inData)) {
        throw new Error("输入函数配置出错：" + runner.inData.toString());
    }
    // Build Method
    if (!uri) {
        throw new Error("路径出错：" + uri);
    }
    const secure = uri.startsWith("/api");
    const ajaxFn = secure ? API_SECURE[method] : API_PUB[method];
    if (Ux.isFunction(ajaxFn)) {
        const request = runner.inData.apply(this, [].concat(args));
        let asyncFuture = Ux.promise(request);
        if (options) {
            asyncFuture = asyncFuture.then(processed => ajaxFn(uri, processed, options));
        } else {
            asyncFuture = asyncFuture.then(processed => ajaxFn(uri, processed));
        }
        asyncFuture = asyncFuture.then(response => outData(response, request));
        if (Ux.isFunction(outFail)) {
            asyncFuture = asyncFuture.catch(error => outFail(error, request));
        }
        return asyncFuture;
    } else {
        throw new Error("关键业务API出错：" + method + " " + uri);
    }
}
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    askRapid,   // No Options
    askWith,    // Options
}