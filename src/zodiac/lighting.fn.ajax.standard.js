import __Zn from './zero.module.dependency';
import __I from './lighting.__.fn.ajax.infrastructure';

const Cv = __Zn.Env;
const ajaxResource = (uri) => {
    const request = new Request(uri, {
        method: "get"
    });
    return fetch(request).then(data => data.text());
};

export default {
    // 非远程模式
    ajaxResource,
    // Public
    ajaxFetch: __I.ajaxRead(Cv.HTTP_METHOD.GET, false),
    ajaxPush: __I.ajaxWrite(Cv.HTTP_METHOD.POST, false),
    // Secure
    ajaxGet: __I.ajaxRead(Cv.HTTP_METHOD.GET, true),
    ajaxPost: __I.ajaxFull(Cv.HTTP_METHOD.POST, true),
    ajaxPut: __I.ajaxFull(Cv.HTTP_METHOD.PUT, true),
    ajaxDelete: __I.ajaxFull(Cv.HTTP_METHOD.DELETE, true),
}