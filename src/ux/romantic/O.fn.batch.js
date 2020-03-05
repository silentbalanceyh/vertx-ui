import Ajx from '../ajax';
import Abs from '../abyss';

const sexBatchState = (reference, callback, config) => {
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
        reference.setState({
            $loading: true,     /* 当前组件中的状态设置 $loading = true */
            $submitting: true,     // 防重复提交
        });
        return callback($selected).then(Ajx.ajax2True(() => {
            /*
             * 处理
             * $dirty, $loading, $submitting
             */
            const state = {
                $dirty: true,           // 脏效果
                $loading: false,        // 加载效果
                $submitting: false,     // 防重复提交
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
            reference.setState(state);
        }, options[message] ? options[message] : message))
    } else {
        throw new Error(`[ Ux ] 选择项丢失！${name}`);
    }
};
const doSubmit = (reference, submitting = true) => {
    /*
     * 提交处理
     */
    const {doSubmitting} = reference.props;
    if (Abs.isFunction(doSubmitting)) {
        doSubmitting(submitting);
    }
};
const doClose = (reference, $selected = []) => {
    doSubmit(reference, false);
    const {rxClose, doDirty} = reference.props;
    if (Abs.isFunction(rxClose)) {
        rxClose();
    }
    if (Abs.isFunction(doDirty)) {
        doDirty(true, {$selected});
    }
};
const sexBatchProp = (reference, callback, config = {}) => {
    const {$selected = []} = reference.props;
    const {
        name = "",          // 日志专用名称
        reset = true,
        message = "",       // message Key（从 options 中读取 message）
    } = config;
    if (0 < $selected.length) {
        /*
         * 提交处理
         */
        doSubmit(reference);
        /*
         * 调用外层的 rxBatchEdit 函数
         */
        return callback($selected).then(Ajx.ajax2True(() => {
            /*
             * $submitting = false
             */
            doClose(reference, reset ? [] : $selected);
        }, message))
    } else {
        throw new Error(`[ Ux ] 选择项丢失！${name}`);
    }
};
export default (reference, callback, config = {}) => {
    /*
     * 1. 先检索 state 中是否包含了 $selected
     * 2. 再检索 props 中是否包含了 $selected
     */
    let $selected = reference.state ? reference.state.$selected : null;
    if (!$selected) {
        return sexBatchProp(reference, callback, config);
    } else {
        return sexBatchState(reference, callback, config);
    }
};