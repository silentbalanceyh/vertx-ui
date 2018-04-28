import {createAction} from 'redux-act';
import {Taper, zero} from "environment";
import {DataLabor} from "entity";
import {Set} from 'immutable'
import routeData from '../route'
import Random from './Ux.Random'
import Debug from './Ux.Debug';

/**
 * 自动生成路由专用函数
 * @method route
 * @param container 生成路由的Layout组件
 * @param components 生成路由的Page组件
 * @return {Array}
 */
const route = (container = {}, components = {}) => {
    // 先处理定义路由
    const routes = [];
    let $keys = Set(Object.keys(components));
    if (routeData.special) {
        const route = {};
        const fnItem = (layout) => componentKey => {
            if (components[componentKey]) {
                route.container = layout;
                route.component = components[componentKey];
                route.uri = componentKey.replace(/_/g, '/');
                route.key = Random.randomString(16);
                routes.push(route);
                $keys = $keys.remove(componentKey);
            }
        };
        for (const key in routeData.special) {
            // Container
            let layout = undefined;
            if (container[key]) {
                layout = container[key];
            }
            // Components
            if (layout) {
                const componentKeys = routeData.special[key];
                componentKeys.forEach(fnItem(layout));
            }
        }
    }
    // 处理默认模板
    if (routeData.defined) {
        if (container[routeData.defined]) {
            const keyList = $keys.toJS();
            const route = {};
            keyList.forEach(componentKey => {
                if (components[componentKey]) {
                    route.container = container[routeData.defined];
                    route.component = components[componentKey];
                    route.uri = componentKey.replace(/_/g, '/');
                    route.key = Random.randomString(16);
                    routes.push(route);
                }
            })
        }
    }
    return routes;
};
/**
 * @class Env
 * @description 环境变量专用类信息
 */
export default {
    LANG: process.env.$LANG,
    ENDPOINT: process.env.$ENDPOINT,
    APP: process.env.$APP,
    EVENT: process.env.$K_EVENT,
    KEY_USER: `${process.env.$K_SESSION}SESSION/USER`,
    KEY_APP: `${process.env.$K_SESSION}SESSION/APP/${process.env.$APP.toUpperCase()}`,
    ENTRY_LOGIN: `/${process.env.$PATH}${process.env.$LOGIN}`,
    ENTRY_ADMIN: `/${process.env.$PATH}${process.env.$MAIN}`,
    MAP_KEY: process.env.$MAP_KEY,
    DEBUG: Boolean("development" === process.env.NODE_ENV && process.env.$DEBUG),
    MOCK: Boolean("development" === process.env.NODE_ENV && process.env.$MOCK),
    /**
     * 专用常量文件，描述HTTP方法
     * @method HTTP_METHOD
     */
    HTTP_METHOD: {
        GET: "get",
        POST: "post",
        PUT: "put",
        DELETE: "delete"
    },
    /**
     * 专用常量文件，描述MIME媒体类型
     * @method MIMES
     */
    MIMES: {
        JSON: "application/json"
    },
    /**
     * 专用常量文件，描述HTTP协议头类型
     * @method HTTP11
     */
    HTTP11: {
        "ACCEPT": "Accept",
        "ACCEPT_CHARSET": "Accept-Charset",
        "ACCEPT_ENCODING": "Accept-Encoding",
        "ACCEPT_LANGUAGE": "Accept-Language",
        "ACCEPT_RANGES": "Accept-Ranges",
        "AGE": "Age",
        "ALLOW": "Allow",
        "AUTHORIZATION": "Authorization",
        "CACHE_CONTROL": "Cache-Control",
        "CONNECTION": "Connection",
        "CONTENT_BASE": "Content-Base",
        "CONTENT_ENCODING": "Content-Encoding",
        "CONTENT_LENGTH": "Content-Length",
        "CONTENT_LOCATION": "Content-Location",
        "CONTENT_MD5": "Content-MD5",
        "CONTENT_RANGE": "Content-Range",
        "CONTENT_TYPE": "Content-Type",
        "DATE": "Date",
        "ETAG": "ETag",
        "EXPIRES": "Expires",
        "FORM": "Form",
        "HOST": "Host",
        "IF_MODIFIED_SINCE": "If-Modified-Since",
        "IF_MATCH": "If-Match",
        "IF_NONE_MATCH": "If-None-Match",
        "IF_RANGE": "If-Range",
        "IF_UNMODIFIED_SINCE": "If-Unmodified-Since",
        "LAST_MODIFIED": "Last-Modified",
        "LOCATION": "Location",
        "MAX_FORWARDS": "Max-Forwards",
        "PRAGMA": "Pragma",
        "PROXY_AUTHENTICATE": "Proxy-Authenticate",
        "PROXY_AUTHORIZATION": "Proxy-Authorization",
        "PUBLIC": "Public",
        "RANGE": "Range",
        "REFENER": "Refener",
        "RETRY_AFTER": "Retry-After",
        "SERVER": "Server",
        "TRANSFER_ENCODING": "Transfer-Encoding",
        "UPGRADE": "Upgrade",
        "USER_AGENT": "User-Agent",
        "VARY": "Vary",
        "WARNING": "Warning",
        "WWW_AUTHENTICATE": "WWW-Authenticate"
    },
    /**
     * Redux专用状态树的写入方法
     * @method dataOut
     * @param data 被写入的数据
     */
    dataOut: (data) => Taper.fnFlush(DataLabor.createIn(data)),
    /**
     * Redux专用状态树的读取方法
     * @method dataIn
     * @param state Redux读取到的状态
     */
    dataIn: (state) => DataLabor.createOut(state),
    dgRouter: Debug.dgRouter,
    dgFileJson: Debug.dgFileJson,
    dgForm: Debug.dgForm,
    dgMonitor: Debug.dgMonitor,
    dgScript: Debug.dgScript,
    /**
     * Redux中的Action专用创建函数
     * @method createAction
     * @param path 创建的Action对应的路径
     * */
    createAction: (path) => createAction(`${process.env.$K_EVENT}${path}`),
    route,
    /**
     * 专用zero的注解
     * @method zero
     */
    zero
}
