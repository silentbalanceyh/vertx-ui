import __Zn from './zero.module.dependency';
import __V_PARSER from './syntax.__.fn._.attribute.parser';

const required = (item = []) => {
    const config = {};
    config.required = true;
    config.message = item[0] ? item[0] : "";
    return config;
};
const requiredAdvanced = (item = []) => {
    const config = {};
    config.validator = "required";
    config.message = item[0] ? item[0] : "";
    return config;
};
const requiredBool = (status = true) => (item = {}) => {
    const config = {};
    config.validator = "required";
    config.message = item[0] ? item[0] : "";
    config.status = status;
    return config;
};
const RULER = {
    required,
    requiredAdvanced,
    requiredTrue: (item = {}) => requiredBool(true)(item),
    requiredFalse: (item = {}) => requiredBool(false)(item)
}
const applyRules = (rules = []) => {
    const processed = [];
    rules.forEach(rule => {
        if ("string" === typeof rule) {
            const parsed = rule.replace(/ /g, '').split(',');
            const ruler = parsed.shift();
            const executorFn = RULER[ruler];
            let result;
            if (__Zn.isFunction(executorFn)) {
                result = executorFn(parsed);
                if (result) processed.push(result);
            } else {
                console.error(`无法识别规则${ruler}，请提供合法规则！`);
            }
        } else {
            processed.push(rule);
        }
    })
    return processed;
}
const applyKv = (item = {}, config = [], kvs = []) => {
    if (kvs.length >= config.length && item.hasOwnProperty(__Zn.Env.SYNTAX_KV)) {
        for (let idx = config.length - 1; idx < kvs.length; idx++) {
            const literal = kvs[idx];
            const expr = literal.replace(/ /g, "");
            if (0 < expr.indexOf("=")) {
                const name = expr.split("=")[0];
                const value = expr.split("=")[1];
                const parserFn = __V_PARSER[name];
                if (__Zn.isFunction(parserFn)) {
                    parserFn(item, value);
                } else {
                    console.error(`无法识别${name}=${value}，请提供解析器！`);
                }
            }
        }
        delete item[__Zn.Env.SYNTAX_KV];
    }
    return item;
}
export default {
    applyRules,
    applyKv,
}