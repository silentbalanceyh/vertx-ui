import Ut from '../../unity';
import Ajax from '../../ajax';
import Abs from '../../abyss';

import Cmn from './I.common';
import U from 'underscore';

const _submit = (reference, config, redux = false) => {
    // $loading设置
    reference.setState({$loading: true});
    return Ut.formSubmit(reference, redux)
        /* Performer */
        .then(data => Cmn.performFn(reference, config)
            /* 记得拷贝数据传入 perform，否则 data 无法被扩展 */
            .then(perform => perform(data))
        )
};
const RESET = (reference, config = {}) => (event) => {
    Abs.prevent(event);
    Ut.formReset(reference);
    Cmn.performFn(reference, config)
        /* 执行函数 */
        .then(perform => perform(event));
};
const SUBMIT = (reference, config = {}) => (event) => {
    Abs.prevent(event);
    return _submit(reference, config)
        /* 统一 Error 处理 */
        .catch(error => Ajax.ajaxError(reference, error))
};
/*
 * 比 SUBMIT 多一层 redux 的提交
 */
const SUBMIT_REDUX = (reference, config = {}) => (event) => {
    Abs.prevent(event);
    // $loading设置
    Ut.writeSubmit(reference);

    return _submit(reference, config, true)
        /* 统一 Error 处理 */
        .catch(error => Ajax.ajaxError(reference, error, true))
};
const SUBMIT_DIALOG = (reference, config = {}) => (event) => {
    // 外置的 $submitting = true
    const {doSubmitting} = reference.props;
    if (U.isFunction(doSubmitting)) {
        doSubmitting();
    }
    return _submit(reference, config)
        .catch(error => Ajax.ajaxError(reference, error))
};
const KEY = (reference, config = {}) => (event) => {
    Abs.prevent(event);
    // $loading设置
    reference.setState({$loading: true});
    return Ut.formSubmit(reference)
        /* Performer */
        .then(data => Abs.promise({key: data.key}))
        /* */
        .then(data => Cmn.performFn(reference, config)
            /* 记得拷贝数据传入 perform，否则 data 无法被扩展 */
            .then(perform => perform(data))
        )
        /* 统一 Error 处理 */
        .catch(error => Ajax.ajaxError(reference, error))
};
const SAVE_ROW = (reference, config = {}) => (event) => {
    Abs.prevent(event);
    // 外置的 $submitting = true
    const {doSubmitting} = reference.props;
    if (U.isFunction(doSubmitting)) {
        doSubmitting();
    }
    return Ut.formSubmit(reference)
        .then(data => Cmn.performFn(reference, config)
            .then(perform => perform(data)))
        .catch(error => Ajax.ajaxError(reference, error))
};
export default {
    RESET,          // 重置（Ant Design专用）
    SUBMIT,         // （Ajax）标准提交
    SUBMIT_REDUX,   // （Ajax）表单提交（带Redux）
    SUBMIT_DIALOG,  // （Ajax）弹框表单提交
    KEY,            // （Ajax）删除专用
    SAVE_ROW,       // 子表单提交（客户端保存）
}