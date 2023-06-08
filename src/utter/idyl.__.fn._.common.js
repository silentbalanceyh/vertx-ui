import Ux from "ux";

const switcher = (reference, name, supplier) => {
    if ("string" === typeof name && name.startsWith("rx")) {
        const fun = reference.props[name];
        /*
         * 注意参数本身使用了拷贝，目的是防止：
         * 1）props 过来的参数本来不可变更
         * 2）state 过来的参数可以更改，由于是 Object 内部改动，不会触发 re-render，所以禁止更改
         */
        if (Ux.isFunction(fun)) {
            return (params = {}) => fun(Ux.clone(params));
        } else {
            return (params = {}) => supplier(Ux.clone(params));
        }
    } else {
        throw new Error("[ Ex ] 为兼容 Ux 组件，传入的函数名必须 `rx` 前缀！");
    }
};
/*
 * 核心状态管理
 */
const boolean = (reference, key, value = true) => (event) => {
    const addOn = Ux.prevent(event);
    const state = {};
    state[key] = value;
    Object.assign(state, addOn);
    Ux.of(reference).in(state).done();
    // reference.?etState(state);
};

const seek = (reference, fnName, config = {}) => (args) => {
    const {
        inState = false,
        inError = true
    } = config;
    if (reference) {
        if (Ux.isFunctionName(fnName)) {
            /* 参数规范化 */
            args = (args && Ux.isArray(args)) ? args : [];
            /* 优先从 props 中读取 函数 */
            let fun = reference.props[fnName];
            if (Ux.isFunction(fun)) {
                return fun.apply(this, [].concat(args));
            } else {
                if (inState) {
                    /* 没找到的情况，直接从 state 中读取 */
                    fun = reference.state[fnName];
                    if (Ux.isFunction(fun)) {
                        /* 补充当前状态改变 */
                        return fun.apply(this, [].concat(args));
                    } else {
                        const message = `[ Ex ] ${fnName} 函数出错！`;
                        if (inError) {
                            throw new Error(message);
                        }
                    }
                } else {
                    const message = `[ Ex ] ${fnName} 函数未出现在 props 中！`;
                    if (inError) {
                        throw new Error(message);
                    }
                }
            }
        } else {
            throw new Error("[ Ex ] 为兼容 Ux 组件，传入的函数名必须 `fn` 前缀或 `rx` 前缀！");
        }
    } else {
        throw new Error("[ Ex ] 空 reference 引用！");
    }
};
export default {
    switcher,
    /* 内部调用 */
    boolean,
    seek,
    // 关闭错误
    OFF_ERROR: {
        inError: false,
    }
}