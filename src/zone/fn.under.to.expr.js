import __IS_DECISION from './fn.under.is.decision';
import __IS_BUSINESS from './fn.under.is.business';
import __V from './fn.assort.value.typed';
import __Enc from './fn.unity.encrypt';
import __Env from './v.environment';
import __IS from "zone/fn.under.is.decision";

const __Is = {
    ...__IS_BUSINESS,
    ...__IS_DECISION
}
const toKV = (input) => {
    if (__Is.isObject(input) && 1 === Object.keys(input).length) {
        const kv = {};
        Object.keys(input).forEach(key => {
            // from -> to
            kv.from = key;
            kv.to = input[key];
            // key = value
            kv.key = key;
            kv.value = input[key];
        });
        return kv;
    }
}
const toWidth = (literal = "") => {
    if ("string" === typeof literal) {
        let width = 0;
        for (let idx = 0; idx < literal.length; idx++) {
            const str = String(literal.charAt(idx));
            if (__Is.isCn(str)) {
                width += 2;
            } else {
                width += 1;
            }
        }
        return width;
    } else return -1;
};
const toProtocol = (value = "", port = 0) => {
    // <protocol>://<username>:<password>@<hostname>:<port>/<path>
    const first = value.split('//');
    const result = {};
    result.protocol = first[0];
    // 第一次解析剩余部分
    let left = first[1];
    if (left) {
        // 是否包含 @
        if (0 < left.indexOf("@")) {
            const parsed = left.split('@');
            const account = parsed[0] ? parsed[0].split(":") : [];
            if (2 === account.length) {
                result.username = account[0];
                result.password = account[1];
            }
            left = parsed[1] ? parsed[1] : "";
        }
        // 不包含的处理和之后的处理
        {
            const parsed = left.split("/");
            // 第一部分
            left = parsed[0] ? parsed[0] : "";
            // 最后一部分
            result.path = `/${parsed[1]}`;
        }
        // 第一部分
        if (0 < left.split(":")) {
            const parsed = left.split(":");
            result.hostname = parsed[0];
            result.port = __V.valueInt(parsed[1], port);
        } else {
            result.hostname = left;
            result.port = port;
        }
    }
    if (!result.path) {
        result.path = "/";
    }
    return result;
}
const toLoading = (consumer, seed) => {
    /*
     * 改成 1 ms 毫秒级（略微加载效果）
     * 5 倍距离
     */
    const ms = __V.valueInt(__Env['LOADING'], 1);
    const loadingMs = seed ? seed : 0;
    setTimeout(consumer, ms * loadingMs);
};
const toQuery = (name = "") => {
    const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    const r = window.location.search.substr(1).match(reg);
    let result = null;
    if (r != null) {
        result = unescape(r[2]);
    }
    if (result && "target" === name) {
        if (0 > result.toString().indexOf("/")) {
            /*
             * 不包含 / 符合的时候做 Decrypt，兼容旧系统
             * 特殊参数处理
             */
            result = __Enc.decryptBase64(result);
        }
    }
    return result;
};


const toCssClass = (jsxOrExpr, inClassName) => {
    if ("string" === typeof jsxOrExpr) {
        // 如果是String
        if (0 <= jsxOrExpr.indexOf(inClassName)) {
            // 已包含
            return jsxOrExpr;
        } else {
            // 未包含，注意中间空白不能少
            return `${jsxOrExpr} ${inClassName}`;
        }
    } else if (__IS.isObject(jsxOrExpr)) {
        const {className = ""} = jsxOrExpr;
        jsxOrExpr.className = toCssClass(className, inClassName);
    }
}
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    /*
     * { name: value }  ->
     * {
     *     from:    name,
     *     to:      value,
     *     key:     name,
     *     value:   value
     * }
     * 1) 模式1：from -> to        映射
     * 2) 模式2：key  -> value     键值
     */
    toKV,
    toWidth,
    toQuery,
    toProtocol,
    toLoading,
    toCssClass,
}