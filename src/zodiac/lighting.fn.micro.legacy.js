import __Zn from './zero.module.dependency';
import __I from './lighting.__.fn.ajax.infrastructure';

const Cv = __Zn.Env;

const __serviceApi = (serviceName = "", uri = "") => `/${serviceName}${uri}`.replace(/\/\//g, "/");

export default {
    // Public
    microFetch: (service, uri, params = {}, options) =>
        __I.ajaxRead(Cv.HTTP_METHOD.GET, false)(__serviceApi(service, uri), params, options),
    microPush: (service, uri, params = {}, options) =>
        __I.ajaxWrite(Cv.HTTP_METHOD.GET, false)(__serviceApi(service, uri), params, options),
    // Secure
    microGet: (service, uri, params = {}, options) =>
        __I.ajaxRead(Cv.HTTP_METHOD.GET, true)(__serviceApi(service, uri), params, options),
    microPost: (service, uri, params = {}, options) =>
        __I.ajaxFull(Cv.HTTP_METHOD.POST, true)(__serviceApi(service, uri), params, options),
    microPut: (service, uri, params = {}, options) =>
        __I.ajaxFull(Cv.HTTP_METHOD.PUT, true)(__serviceApi(service, uri), params, options),
    microDelete: (service, uri, params = {}, options) =>
        __I.ajaxFull(Cv.HTTP_METHOD.DELETE, true)(__serviceApi(service, uri), params, options),
}