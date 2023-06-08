import __Zn from './zero.module.dependency';

const __sexBatchState = (reference, callback, config) => {
    /*
     * 1. 先检索 state 中是否包含了 $selected
     * 2. 再检索 props 中是否包含了 $selected
     */
    const $selected = reference.state ? reference.state.$selected : null;
    const {options = {}} = reference.state;
    const {
        name = "",          // 日志专用名称
        reset = true,       // 默认清空 $selected
        message = "",       // message Key（从 options 中读取 message）
    } = config;
    if (0 < $selected.length) {
        const content = options[message] ? options[message] : message;
        return __Zn.of(reference).spinning().future(() =>
            callback($selected).then(__Zn.ajax2True(() => {
                /*
                 * 处理
                 * $dirty, $loading, $submitting
                 */
                const state = {
                    //$dirty: true,           // 脏效果
                    //$loading: false,        // 加载效果
                    //$submitting: false,     // 防重复提交
                };
                if (reset) {
                    /*
                     * 删除的时候使用
                     */
                    $selected.splice(0, $selected.length);
                    state.$selected = [];
                }
                /*
                 * 继承模式
                 */
                // reference.?etState(state);
                __Zn.of(reference).in(state).loading().done();
            }, content))
        )
        // reference.?etState({
        //     $loading: true,     /* 当前组件中的状态设置 $loading = true */
        //     $submitting: true,     // 防重复提交
        // });
        // return callback($selected).then(__Zn.ajax2True(() => {
        //     /*
        //      * 处理
        //      * $dirty, $loading, $submitting
        //      */
        //     const state = {
        //         $dirty: true,           // 脏效果
        //         $loading: false,        // 加载效果
        //         $submitting: false,     // 防重复提交
        //     };
        //     if (reset) {
        //         /*
        //          * 删除的时候使用
        //          */
        //         $selected.splice(0, $selected.length);
        //         state.$selected = [];
        //     }
        //     /*
        //      * 继承模式
        //      */
        //     reference.?etState(state);
        // }, options[message] ? options[message] : message))
    } else {
        throw new Error(`[ Ux ] 选择项丢失！${name}`);
    }
};
const __doClose = (reference, $selected = []) => {
    const {rxClose, doDirty} = reference.props;
    if (__Zn.isFunction(rxClose)) {
        rxClose();
    }
    if (__Zn.isFunction(doDirty)) {
        doDirty(true, {$selected});
    }
};
const __sexBatchProp = (reference, callback, config = {}) => {
    const {$selected = []} = reference.props;
    const {
        name = "",          // 日志专用名称
        reset = true,
        message = "",       // message Key（从 options 中读取 message）
    } = config;
    if (0 < $selected.length) {
        const {options = {}} = reference.state;
        const content = options[message] ? options[message] : message;
        /*
         * 调用外层的 rxBatchEdit 函数
         */
        return callback($selected).then(__Zn.ajax2True(() => {
            /* $submitting = false */
            __doClose(reference, reset ? [] : $selected);
        }, content))
    } else {
        throw new Error(`[ Ux ] 选择项丢失！${name}`);
    }
};
const sexBatch = (reference, callback, config = {}) => {
    /*
     * 1. 先检索 state 中是否包含了 $selected
     * 2. 再检索 props 中是否包含了 $selected
     */
    let $selected = reference.state ? reference.state.$selected : null;
    if (!$selected) {
        return __sexBatchProp(reference, callback, config);
    } else {
        return __sexBatchState(reference, callback, config);
    }
};
export default {
    sexBatch,
}