import U from 'underscore';
import Ux from 'ux';
import React from 'react';
import IxLoading from '../IxLoading/UI';

const fnState = (ref, options = {}) => {
    /*
     * 抽取核心函数
     */
    const fnVerify = U.isFunction(options.verify) ? options.verify(options.type) : () => true;
    const fnHoc = U.isFunction(options.hoc) ? options.hoc(options.type) : () => ({});
    let error = undefined;
    if (U.isFunction(fnVerify)) {
        // fnVerify 需要验证的是传入的属性内容，而不是当前，由于构造部分还没完成
        error = fnVerify(ref);
    }
    // 不验证的情况 error 就是 undefined
    if (!error) {
        const state = Ux.clone(options.state);
        if (U.isFunction(fnHoc)) {
            const added = fnHoc(ref, options.type);
            Object.assign(state, added);
        }
        /*
         * 最终状态写入
         */
        state.ready = true;
        return state;
    } else {
        return {error};
    }
};

export default (options = {}) => {
    // 防止 ... 操作到 undefined
    if (!options.state) options.state = {};
    /*
     * Ex专用注解，高阶封装，对组件进行核心封装
     */
    return (target, property, descriptor) => {
        // 定义新的 class
        return class hoc extends target {
            constructor(props) {
                super(props);
                const initState = fnState(this, options);
                Ux.dgDebug(initState, "[Ex] 初始化状态：");
                this.state = {
                    error: undefined, // 默认的错误信息,
                    ...initState
                };
            }

            render() {
                const {error} = this.state;
                if (error) {
                    return Ux.fxError(error);
                } else {
                    /* 特殊变量必须保证 */
                    const {ready = false} = this.state;
                    return ready ? super.render() : <IxLoading/>;
                }
            }
        };
    };
};