import U from 'underscore'

const fnError = {
    10000: (type, current) => `[ ERR-10000 ] 传入参数类型不匹配，期望类型${type}，当前参数类型${current}`,
    10001: (name, key) => `[ ERR-10001 ] Hoc高阶组件绑定资源文件：${name}.json 中缺失了该组件所需配置节点：${key}`,
};
export default {

    fxTerminal: (fnCond, code, ...args) => {
        const checked = U.isFunction(fnCond) ? fnCond() : fnCond;
        if (checked) {
            const fn = fnError[code];
            if (U.isFunction(fn)) {
                const message = fn.apply(this, args);
                console.error(message + "!!!");
                return message;
            }
        }
    }
}