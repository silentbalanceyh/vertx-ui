import Cv from "../constant";
import E from "../error";
import Abs from '../abyss';
import U from "underscore";
import Ut from '../unity';
// 开发专用
import Dev from '../develop';

/**
 * ## 特殊私有函数
 *
 * 该函数近似于 `itObject`，但在处理过程中，仅用于 `ajax` 库中处理核心函数 criteria 函数，这种类型的处理十分特殊，它只负责
 * 处理 uri 中带路径函数的情况：`/api/:name`这种情况，在这种情况中，有可能传入参数如下：
 *
 * ```json
 * {
 *     "criteria": {
 *         "email": "lang.yu@hpe.com",
 *         "": true,
 *         "$0": {
 *              "name,=": "doc-api"
 *         }
 *     }
 * }
 * ```
 *
 * 上述参数生成的 connector 如下：
 *
 * ```json
 * {
 *     "email": "lang.yu@hpe.com",
 *     "name": "doc-api"
 * }
 * ```
 *
 * 使用参数格式直接替换路径中的 `:name` 参数生成：`/api/doc-api` 的最终路径信息。
 *
 * @memberOf module:__private
 * @param {Object} criteria 查询条件专用方法
 * @param {Object} collector 最终计算的收集器，收集所有数据信息
 */
const ajaxPatternValue = (criteria = {}, collector = {}) => {
    // eslint-disable-next-line
    for (const key in criteria) {
        if (criteria.hasOwnProperty(key)) {
            let value = criteria[key];
            if (!U.isArray(value) && U.isObject(value)) {
                ajaxPatternValue(value, collector);
            } else {
                /*
                 * 处理 field,op 的格式，只提取 field
                 */
                let field;
                if (0 < key.indexOf(',')) {
                    field = key.split(',')[0];
                } else {
                    field = key;
                }
                if ("" !== field) {
                    /*
                     * value 处理，如果数组取第一个元素替换
                     */
                    if (Abs.isArray(value)) {
                        value = value[0];
                    }
                    collector[field] = value;
                }
            }
        }
    }
};
/**
 * ## 特殊私有函数「Qr」
 *
 * 该函数同样用于 uri 的路径参数解析，并且是查询引擎专用方法，特殊查询参数才会使用，参数`params`为查询引擎参数，它的基本
 * 格式如：
 *
 * ```json
 * {
 *     "criteria": {
 *         "...": "查询条件参数"
 *     }
 * }
 * ```
 *
 * 该函数内部会调用 `ajaxPatternValue` 执行参数本身的`拉平`解析步骤。
 *
 * @memberOf module:__private
 * @param {String} uri ajax调用访问的路径信息
 * @param {Object} params 传入的参数信息，该参数可以是来自 body
 * @return {String} 返回处理过后的 uri normalized 结果
 */
const ajaxPatternUri = (uri, params = {}) => {
    let api = uri;
    // 只有带有路径参数的才执行这个递归
    if (params.hasOwnProperty("criteria") && 0 < api.indexOf(":")) {
        try {
            const $params = {};
            ajaxPatternValue(params.criteria, $params);
            Dev.dgDebug($params, "[Ux] 拉平过后的数据处理：");
            api = Ut.formatExpr(api, $params, true);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    return api;
};
/**
 * ## 特殊私有函数
 *
 * 该方法执行步骤：
 *
 * 1. 先执行`pattern`的直接解析。
 * 2. 再执行带`criteria`的深度解析，Qr模式的内容。
 * 3. 如果环境变量打开了数字签名，执行uri的数字签名。
 * 4. 解析`GET/DELETE`方法专用的 query string 的内容。
 * 5. 根据 HTTP 的方法判断是否要追加 query 到最终路径中。
 *
 * @memberOf module:__private
 * @param {String} uri 未解析的原始路径
 * @param {String} method HTTP方法名称，大小写无碍
 * @param {Object} params 当前请求需要的所有参数对
 * @return {String} 执行过处理的路径（解析后）
 */
const ajaxUri = (uri, method = "get", params = {}) => {
    let api = Ut.formatExpr(uri, params, true);
    // 针对查询引擎的特殊填充
    api = ajaxPatternUri(api, params);
    // 签名
    if (Cv.SIGN) {
        Ut.signature(api, method, params);
    }
    // 追加Query
    const query = Ut.formatQuery(uri, params);
    // 最终请求路径
    api = "get" === method || "delete" === method ?
        `${Cv['ENDPOINT']}${api}${query}` :
        `${Cv['ENDPOINT']}${api}`;
    return api;
};
/**
 * ## 私有函数
 *
 * XSRF请求专用，从cookie中读取XSRF的Token并且放在 xsrf 头中。
 *
 * @memberOf module:__private
 * @param {Object} headers 请求头相关信息
 */
const ajaxXSRF = (headers = {}) => {
    // TODO: 执行 xsrfToken 请求
    const xsrfToken = undefined;
    if (xsrfToken) {
        headers.append(Cv.HTTP11.XSRF_TOKEN, xsrfToken);
    }
};
/**
 * ## 私有函数
 *
 * 针对 headers 的服务端偏好和客户端偏好的默认处理（处理 Mime）
 *
 * 1. 默认的 Content-Type 的值：application/json
 * 2. 默认的 Accept 的值：application/json;q=1
 *
 * @memberOf module:__private
 * @param {boolean} secure 是否执行安全请求处理，安全请求会带上 Authorization
 * @return {Headers} 返回 fetch 库中的 Headers 类型数据
 */
const ajaxHeaderJ = (secure = false) => {
    const headers = new Headers();
    headers.append(Cv.HTTP11.ACCEPT, Cv.MIMES.JSON);
    headers.append(Cv.HTTP11.CONTENT_TYPE, Cv.MIMES.JSON);
    // 处理Authorization
    ajaxHeader(headers, secure);
    return headers;
};
/**
 * ## 私有函数「Zero」
 *
 * 处理Zero Ui框架自带的 Http请求头相关信息，支持两种模式处理请求头
 *
 * 1. secure = true：安全模式，会加入 Authorization 头信息，使用 token信息。
 * 2. secure = false：非安全模式的请求头相关信息。
 *
 * 检查环境变量看是否开启了`X_HEADER_SUPPORT`执行，如果开启了则直接对接 Zero 框架，如果对接框架，则
 * 引入`X-App-Key、X-App-Id、X-Sigma、X-Lang`四个参数。
 *
 * * X-App-Key|X-App-Id：应用相关参数
 * * X-Sigma：容器专用环境 sigma 参数
 * * X-Lang：多语言环境，用于提供语言信息，从环境变量中获取
 *
 * @memberOf module:__private
 * @param {Headers} headers 构造的 Headers 对象
 * @param {boolean} secure 执行安全和非安全模式处理
 */
const ajaxHeader = (headers = {}, secure = false) => {
    if (secure) {
        const token = Ut.token();
        E.fxTerminal(!token, 10065, token);
        headers.append(Cv.HTTP11.AUTHORIZATION, token);
    }
    /* 启用了 X_ 的Header发送请求 */
    if (Cv['X_HEADER_SUPPORT']) {
        /* X_APP_KEY */
        const appKey = Ut.Storage.getDirect(Cv.X_APP_KEY);
        if (appKey) headers.append(Cv.X_HEADER.X_APP_KEY, appKey);
        /* X_APP_ID */
        const appId = Ut.Storage.getDirect(Cv.X_APP_ID);
        if (appId) headers.append(Cv.X_HEADER.X_APP_ID, appId);
        /* X_SIGMA */
        const sigma = Ut.Storage.getDirect(Cv.X_SIGMA);
        if (sigma) headers.append(Cv.X_HEADER.X_SIGMA, sigma);
        /* X_LANG */
        const language = Cv['LANGUAGE'] ? Cv['LANGUAGE'] : "cn";
        if (language) headers.append(Cv.X_HEADER.X_LANG, language);
    }
    ajaxXSRF(headers);
};
/**
 * ## 私有函数
 *
 * 1. 追加`language`字段信息，从环境变量中读取，注意查询引擎 Qr 参数不追加 language。
 * 2. 是否包含 $body 参数，如果包含则直接将 `$body` 作为 Http 请求体。
 *
 * $body 的存在主要是用于路径和请求体同时存在的情况，如：
 *
 * ```shell
 * PUT /api/user/:key
 * ```
 *
 * 上述请求中，请求内容很可能是：
 *
 * ```json
 * {
 *     "key": "用户id信息",
 *     "$body": {
 *         "...": "请求体内容"
 *     }
 * }
 * ```
 *
 * @memberOf module:__private
 * @param {Object} params 参数相关信息
 * @return {String} 核心数据内容，以字符串的方式存储
 */
const ajaxParams = (params = {}) => {
    const language = Cv['LANGUAGE'] ? Cv['LANGUAGE'] : "cn";
    const itLang = (data) => Abs.itObject(data, (field, value) => {
        if (U.isArray(value)) {
            data[field].filter(U.isObject).forEach(item => itLang(item));
        } else {
            if (U.isObject(data) && !U.isArray(data)) {
                data.language = language;
            }
        }
    });
    let requestBody;
    if (params.hasOwnProperty("$body")) {
        if (!U.isArray(params.$body)) {
            itLang(params.$body);
        }
        requestBody = JSON.stringify(params.$body);
    } else {
        // 拷贝 language = cn 的问题
        if (!params.hasOwnProperty('criteria')) {
            itLang(params);
        }
        requestBody = JSON.stringify(params);
    }
    return requestBody;
};
/**
 * ## 私有函数「Zero」
 *
 * 响应处理器，解析 Zero 中的响应数据专用，Zero 中的响应数据如下：
 *
 * ```json
 * {
 *     "data": "...响应格式"
 * }
 * ```
 *
 * * 在搜索引擎返回页面中，`data`包含`list`和`count`两个参数（包括分页的最终统计）
 * * 在直接界面中，`data`的格式如`[]`格式，Array数组。
 * * 在其他响应数据中，`data`的格式如`{}`的 Object 数据格式。
 *
 * @memberOf module:__private
 * @param {Object} body Zero中的核心响应格式
 * @return {Object|Array} 解析过后的格式，`body.data`的数据信息
 */
const ajaxAdapter = (body = {}) => {
    return body.data ? body.data : body;
};
/**
 * ## 私有函数
 *
 * 跨域访问专用参数，针对不同的跨域模式使用不同的跨域参数，跨域受环境变量影响
 *
 * 1. CORS_MODE：如果是 cors 则是标准跨域模式
 * 2. CORS_CREDENTIALS：表示跨域中的 credential 的设置信息
 *
 * @memberOf module:__private
 * @param {String} method HTTP相关请求方法
 * @param {Headers} headers HTTP请求头相关信息
 * @param {Object} inputOpts 需要存储的头部信息的相关内容
 * @return {Object} 返回最终的 HTTP 头部信息
 */
const ajaxOptions = (method, headers, inputOpts = {}) => {
    const options = {};
    options.method = method;
    options.headers = headers;
    if (Cv.hasOwnProperty('CORS_MODE')) {
        options.mode = Cv['CORS_MODE'];
    } else {
        options.mode = 'cors';
    }
    if (Cv.hasOwnProperty('CORS_CREDENTIALS')) {
        options.credentials = Cv['CORS_CREDENTIALS'];
    }
    /*
     * 合并传入专用
     */
    if (!Abs.isEmpty(inputOpts)) {
        Object.assign(options, inputOpts);
    }
    return options;
};
export default {
    ajaxAdapter,
    ajaxHeader,
    ajaxHeaderJ,
    ajaxParams,
    ajaxUri,
    ajaxOptions
};