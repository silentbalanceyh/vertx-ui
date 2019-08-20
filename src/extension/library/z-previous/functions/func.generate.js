import U from "underscore";
import Ux from "ux";
import _do from './func.generate.do';
import _ko from './func.generate.ko';

const prevent = (event) => {
    /* 保证调用 */
    if (event && U.isFunction(event.preventDefault)) {
        event.preventDefault();
    }
};
/*
 * 优先选择 name 方法作为函数，只考虑 props 中（外置传入）
 * 其次使用 supplier 作为函数
 */
const switcher = (reference, name, supplier) => {
    if (U.isString(name) && name.startsWith("rx")) {
        const fun = reference.props[name];
        /*
         * 注意参数本身使用了拷贝，目的是防止：
         * 1）props 过来的参数本来不可变更
         * 2）state 过来的参数可以更改，由于是 Object 内部改动，不会触发 re-render，所以禁止更改
         */
        if (U.isFunction(fun)) {
            return (params = {}) => fun(Ux.clone(params));
        } else {
            return (params = {}) => supplier(Ux.clone(params));
        }
    } else {
        throw new Error("[ Ex ] 为兼容 Ux 组件，传入的函数名必须 `rx` 前缀！");
    }
};
const boolean = (reference, key, value = true) => (event) => {
    /* 事件拦截 */
    prevent(event);
    const state = {};
    state[key] = value;
    reference.setState(state);
};
export default {
    generate: (reference) => ({
        /* 显示隐藏 */
        visible: boolean(reference, "$visible"),
        invisible: boolean(reference, "$visible", false),
        /* 数据加载 */
        loading: boolean(reference, "$loading"),
        loaded: boolean(reference, "$loading", false),
        /* 提交/防重复 */
        submitting: boolean(reference, "$submitting"),
        submitted: boolean(reference, "$submitting", false),
        /* 脏数据 */
        dirty: boolean(reference, "$dirty"),
        synced: boolean(reference, "$dirty", false)
    }),
    do: _do,    // Do 系列方法
    ko: _ko,    // Progress 过程方法
    /*
     * 原生事件的兼容性方法
     * preventDefault()的调用，特别用于 <a> 以及其他原生 Html 组件
     */
    prevent,
    /*
     * 核心二义选择函数（一般用于生成 promise）
     * 1）如果传入的方法存在于 props 则以该方法为主
     * 2）未传入则根据配置生成 promise
     * 方法清单
     * rxSearch   - ajax.search.uri
     * rxColumn   - ajax.column.full
     * rxColumnMy - ajax.column.my
     */
    switcher,
}