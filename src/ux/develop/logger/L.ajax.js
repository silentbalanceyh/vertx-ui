import Cv from '../../constant';

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