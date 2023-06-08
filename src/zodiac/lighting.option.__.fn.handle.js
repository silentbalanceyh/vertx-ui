import __Zn from './zero.module.dependency';
import __SEC from './secure.fn.digit.signature';

const Cv = __Zn.Env;

const __parseValue = (criteria = {}, collector = {}) => {
    // eslint-disable-next-line
    for (const key in criteria) {
        if (criteria.hasOwnProperty(key)) {
            let value = criteria[key];
            if (!__Zn.isArray(value) && __Zn.isObject(value)) {
                __parseValue(value, collector);
            } else {
                /* 处理 field,op 的格式，只提取 field */
                let field;
                if (0 < key.indexOf(',')) {
                    field = key.split(',')[0];
                } else {
                    field = key;
                }
                if ("" !== field) {
                    /* value 处理，如果数组取第一个元素替换 */
                    if (__Zn.isArray(value)) {
                        value = value[0];
                    }
                    collector[field] = value;
                }
            }
        }
    }
};
const __parseUri = (uri, params = {}) => {
    let api = uri;
    // 只有带有路径参数的才执行这个递归
    if (params.hasOwnProperty("criteria") && 0 < api.indexOf(":")) {
        try {
            const $params = {};
            __parseValue(params.criteria, $params);
            __Zn.dgDebug($params, "[Ux] 拉平过后的数据处理：");
            api = __Zn.formatExpr(api, $params, true);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    return api;
};
const handleUri = (uri, method = "get", params = {}) => {
    let api = __Zn.formatExpr(uri, params, true);
    // 针对查询引擎的特殊填充
    api = __parseUri(api, params);
    // 签名 sig = ?
    if (Cv.SIGN) {
        __SEC.digitSign(api, method, params);
    }
    // 追加Query
    const query = __Zn.formatQuery(uri, params);
    // 最终请求路径
    api = Cv.HTTP_METHOD.GET === method || Cv.HTTP_METHOD.DELETE === method ?
        `${Cv['ENDPOINT']}${api}${query}` :     // GET / DELETE
        `${Cv['ENDPOINT']}${api}`;              // POST / PUT Added
    return api;
};

const __parseLang = (data) => {
    const language = Cv['LANGUAGE'] ? Cv['LANGUAGE'] : Cv.LANGUAGE;
    __Zn.itObject(data, (field, value) => {
        if (__Zn.isArray(value)) {
            data[field].filter(__Zn.isObject).forEach(item => __parseLang(item));
        } else {
            if (__Zn.isObject(data) && !__Zn.isArray(data)) {
                data.language = language;
            }
        }
    })
};
const handleParam = (params = {}, options = {}) => {
    let isForm = false;
    if (options.hasOwnProperty(Cv.HTTP11.CONTENT_TYPE)) {
        isForm = Cv.MIMES.FORM === options[Cv.HTTP11.CONTENT_TYPE];
    }
    if (isForm) {
        const formData = new FormData();
        Object.keys(params).forEach(key => {
            if (__Zn.isObject(params[key]) || __Zn.isArray(params[key])) {
                formData.append(key, __Zn.wayO2S(params[key]));
            } else {
                formData.append(key, params[key]);
            }
        });
        return formData;
    } else {

        let requestBody;
        if (params.hasOwnProperty(Cv.K_NAME.BODY)) {
            if (!__Zn.isArray(params.$body)) {
                __parseLang(params.$body);
            }
            requestBody = __Zn.wayO2S(params.$body);
        } else {
            // 拷贝 language = cn 的问题
            if (!params.hasOwnProperty('criteria')) {
                __parseLang(params);
            }
            requestBody = __Zn.wayO2S(params);
        }
        return requestBody;
    }
};
export default {
    handleUri,
    handleParam,
}