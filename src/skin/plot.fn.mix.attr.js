import U from 'underscore';

const __name = (prefix, content) => {
    if ("string" !== typeof content || "string" !== typeof prefix) {
        console.error("解析类型错误：", prefix, content);
    }
    if (content.startsWith(`${prefix}_`)) {
        return content;
    } else {
        return `${prefix}_${content}`;
    }
}
const mix = (className, styleFn = null, config = {}) => {
    const attrs = {};
    const afterClass = config.className ? config.className : "";
    const beforeClass = config._className ? config._className : "";
    let combined = className;
    // className运算
    if (beforeClass) {
        combined = `${beforeClass} ${combined}`;
    }
    if (afterClass) {
        combined = `${combined} ${afterClass}`
    }
    attrs.className = combined;

    // style运算
    if (styleFn) {
        if (U.isFunction(styleFn)) {
            // 函数级style
            attrs.style = styleFn();
        } else if (U.isObject(styleFn)) {
            // 对象级style
            attrs.style = {};
            Object.assign(attrs.style, styleFn);
        }
    }
    return attrs;
}
const mixUca = (className, styleFn = null, config = {}) => {
    const name = __name("uca", className);
    return mix(name, styleFn, config);
}
const mixMy = (className, styleFn = null, config = {}) => {
    const name = __name("umy", className);
    return mix(name, styleFn, config);
}
const mixUni = (className, styleFn = null, config = {}) => {
    const name = __name("uni", className);
    return mix(name, styleFn, config);
}

const mixHx = (className, styleFn = null, config = {}) => {
    const name = __name("uhx", className);
    return mix(name, styleFn, config);
}
const mixEx = (className, styleFn = null, config = {}) => {
    const name = __name("uex", className);
    return mix(name, styleFn, config);
}
const mixTx = (className, styleFn = null, config = {}) => {
    const name = __name("utx", className);
    return mix(name, styleFn, config);
}
const mixF = (className, styleFn = null, config = {}) => {
    const name = __name("uf", className);
    return mix(name, styleFn, config);
}
const mixG2 = (className, styleFn = null, config = {}) => {
    const name = __name("ug2", className);
    return mix(name, styleFn, config);
}
const mixIx = (className, styleFn = null, config = {}) => {
    const name = __name("uix", className);
    return mix(name, styleFn, config);
}
const mixQx = (className, styleFn = null, config = {}) => {
    const name = __name("uqx", className);
    return mix(name, styleFn, config);
}
const mixOx = (className, styleFn = null, config = {}) => {
    const name = __name("uox", className);
    return mix(name, styleFn, config);
}
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    // 此处API不提供遗留系统前缀，如 ux_
    mix,        // 自由前缀
    mixUni,     // uni_ 前缀
    mixUca,     // uca_ 前缀
    mixMy,      // umy_ 前缀
    mixEx,      // uex_ 前缀
    mixTx,      // utx_ 前缀
    mixF,       // uf_ 前缀
    mixG2,      // ug2_ 前缀
    mixIx,      // uix_ 前缀
    mixQx,      // uqx_ 前缀
    mixHx,      // uhx_ 前缀
    mixOx,      // uox_ 前缀
}