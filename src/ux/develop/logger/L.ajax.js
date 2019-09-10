import Cv from '../../constant';

/**
 * 【开发模式，并且开启Mock】打印Mock数据
 * @method mock
 * @param {Request} request 请求数据
 * @param {Response} response 响应数据
 * @param {String} url 请求的url
 * @return {*}
 */
const mock = (request, response, url) => {
    if (Cv.DEBUG && Cv.MOCK) {
        let message = `%c --->「Zero」 [Ajax] 模拟请求 ${url ? url : ""}`;
        console.groupCollapsed(message, "color:white;background-color:#CD0000;font-weight:900;");
        if (request) {
            console.log("%c 「Zero」 Mock request -> ", 'color:#99CC33', request);
        } else {
            console.log("%c 「Zero」 Mock request -> ( Promise Mode Directly )", 'color:#99CC33');
        }
        console.log("%c 「Zero」 Mock response -> ", 'color:#0099FF', response);
        console.groupEnd();
    }
    return response;
};
/**
 * 【开发模式】打印请求数据
 * @method request
 * @param request 请求的Http方法
 * @param parameters 请求的参数信息
 * @param token 当前请求的token
 */
const request = (request, parameters, token = '') => {
    const method = request.method;
    const uri = request.url;
    if (Cv.DEBUG) {
        let message = `%c --->「Zero」 [Ajax] 真实请求 ${method} ${uri}`;
        const color = Cv.SIGN ? "#06C" : "#4682B4";
        console.groupCollapsed(message, `color:${color};font-weight:900`);
        console.log(`%c 「Zero」 Request -> `, 'color:#7A8B8B;font-weight:900', request);
        if (parameters.criteria) {
            console.log(`%c 「Zero」 Criteria -> `, 'color:#DB7093;font-weight:900', parameters.criteria);
        }
        console.log(`%c 「Zero」 Parameters -> `, 'color:#669966;font-weight:900', parameters);
        console.log(`%c 「Zero」 Uri -> `, 'color:#06C;font-weight:900', uri);
        console.log(`%c 「Zero」 Token -> `, 'color:#339966;font-weight:900', token);
        console.groupEnd();
    }
};
/**
 * 【开发模式】签名专用函数
 * @method sign
 * @param uri 请求的Uri地址
 * @param method 请求的Http方法
 * @param parameters 请求的参数信息
 * @param seed 签名种子值
 * @param sig 签名最终结果
 * @param secret 签名的secret
 */
const sign = (uri, method, parameters, {
    seed, sig, secret
}) => {
    if (Cv.DEBUG) {
        let message = `%c 「Zero」 [Sign] Sign with method ${method}. ( uri = ${uri})`;
        console.groupCollapsed(message, "color:#CCCC33;font-weight:900");
        console.log(`%c 「Zero」 Parameters -> `, 'color:#9999CC;font-weight:900', parameters);
        console.log(`%c 「Zero」 Seed -> `, 'color:#669966;font-weight:900', seed);
        console.log(`%c 「Zero」 Secret -> `, 'color:blue;font-weight:900', secret);
        console.log(`%c 「Zero」 Sig -> `, 'color:red;font-weight:900', sig);
        console.groupEnd();
    }
};

/**
 * 【开发模式】打印响应信息
 * @method response
 * @param data Ajax的错误对象
 * @param params Ajax的正确响应
 * @param request
 * @param isMock
 * @return {*}
 */
const response = (data, params, request = {}, isMock = false) => {
    if (Cv.DEBUG) {
        const {
            method,
            url,
            headers,
        } = request;
        let message = `%c <---「Zero」 [Ajax] 接受响应 ${method} ${url}`;
        const theme = isMock ? "color: white; background-color:#52c41a; font-weight:900" : "color:#548B54;font-weight:900";
        console.groupCollapsed(message, theme);
        const it = headers.entries();
        const headerData = {};
        let item = {done: true};
        do {
            item = it.next();
            const entry = item.value;
            if (entry) {
                headerData[entry[0]] = entry[1];
            }
        } while (!item.done);
        console.log(`%c 「Zero」 Headers -> `, 'color:#c93;font-weight:900', headerData);
        console.log(`%c 「Zero」 Request -> `, 'color:#006699;font-weight:900', params);
        console.log(`%c 「Zero」 Response -> `, 'color:#039;font-weight:900', data);
        console.groupEnd();
    }
    // For fetch api 专用
    return Promise.resolve(data);
};
export default {
    sign,
    request,
    response,
    mock,
}