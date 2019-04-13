import Expr from "../util/Ux.Expr";
import Cv from "../cv/Ux.Constant";
import Sign from "../util/Ux.Sign";
import E from "../Ux.Error";
import Type from "../Ux.Type";
import Debug from '../Ux.Debug';
import U from "underscore";

const ajaxParamDeep = (criteria = {}, collector = {}) => {
    for (const key in criteria) {
        if (key && criteria.hasOwnProperty(key)) {
            const value = criteria[key];
            if (!U.isArray(value) && U.isObject(value)) {
                ajaxParamDeep(value, collector);
            } else {
                collector[key] = value;
            }
        }
    }
};

const ajaxUriDeep = (uri, params = {}) => {
    let api = uri;
    // 只有带有路径参数的才执行这个递归
    if (params.hasOwnProperty("criteria") && 0 < api.indexOf(":")) {
        try {
            const $params = {};
            ajaxParamDeep(params.criteria, $params);
            Debug.dgDebug($params, "[Ux] 拉平过后的数据处理：");
            api = Expr.formatExpr(api, $params, true);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    return api;
};
/**
 * Ajax远程访问过程中的Uri处理器
 * @method ajaxUri
 * @private
 * @param {String} uri 传入的原始路径，如：/api/app/:name
 * @param {String} method 传入的HTTP方法，默认为get
 * @param {Object} params 当前请求的参数数据
 * @return {String}
 */
const ajaxUri = (uri, method = "get", params = {}) => {
    let api = Expr.formatExpr(uri, params, true);
    // 针对查询引擎的特殊填充
    api = ajaxUriDeep(api, params);
    // 签名
    if (Cv.SIGN) {
        Sign.signature(api, method, params);
    }
    // 追加Query
    const query = Expr.formatQuery(uri, params);
    // 最终请求路径
    api = "get" === method || "delete" === method ?
        `${Cv['ENDPOINT']}${api}${query}` :
        `${Cv['ENDPOINT']}${api}`;
    return api;
};
/**
 * XSRF请求专用，从cookie中读取XSRF的Token
 * @method ajaxXSRF
 * @private
 * @param headers
 */
const ajaxXSRF = (headers = {}) => {
    const xsrfToken = undefined;
    if (xsrfToken) {
        headers.append(Cv.HTTP11.XSRF_TOKEN, xsrfToken);
    }
};
/**
 * Ajax远程访问过程中的Header处理器
 * @method ajaxHeader
 * @private
 * @param {Boolean} secure 是否为安全模式？安全模式会添加Authorization头。
 * @return {Headers}
 */
const ajaxHeader = (secure = false) => {
    const headers = new Headers();
    headers.append(Cv.HTTP11.ACCEPT, Cv.MIMES.JSON);
    headers.append(Cv.HTTP11.CONTENT_TYPE, Cv.MIMES.JSON);
    // 处理Authorization
    ajaxSecure(headers, secure);
    return headers;
};
const ajaxSecure = (headers = {}, secure = false) => {
    if (secure) {
        const token = Sign.token();
        E.fxTerminal(!token, 10065, token);
        headers.append(Cv.HTTP11.AUTHORIZATION, token);
    }
    ajaxXSRF(headers);
};
/**
 * Ajax中的特殊参数处理器，如果包含了$body字段值，则将该值当做可处理的参数处理，
 * 该方法参数主要用于处理带路径参数的POST/PUT方法同时使用的场景
 * @method ajaxParams
 * @private
 * @param {Object} params
 * @return {String}
 * @example
 *
 *      // PUT和POST的处理
 *      Ux.ajaxPost("/api/and/tabulars/sigma/:sigma", {
 *          sigma : hotel.sigma,
 *          $body : [
 *              "room.clean.status",
 *              "room.status",
 *              "room.op.status"
 *          ]
 *      }),
 */
const ajaxParams = (params = {}) => {
    const language = Cv['LANGUAGE'] ? Cv['LANGUAGE'] : "cn";
    const itLang = (data) => Type.itObject(data, (field, value) => {
        if (U.isArray(value)) {
            data[field].forEach(item => itLang(item));
        } else {
            if (U.isObject(data)) {
                data.language = language;
            }
        }
    });
    if (params.hasOwnProperty("$body")) {
        itLang(params.$body);
        return JSON.stringify(params.$body);
    } else {
        itLang(params);
        return JSON.stringify(params);
    }
};
/**
 *
 * @param body
 */
const ajaxAdapter = (body = {}) => {
    return body.data ? body.data : body;
};

const ajaxOptions = (method, headers) => {
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
    return options;
};
export default {
    ajaxAdapter,
    ajaxSecure,
    ajaxHeader,
    ajaxParams,
    ajaxUri,
    ajaxOptions
};