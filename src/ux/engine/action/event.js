import Ut from '../../unity';
import Ajax from '../../ajax';
import Cmn from './I.common';
import Abs from '../../abyss';
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
    event.preventDefault();
    Ut.formReset(reference);
    Cmn.performFn(reference, config)
    /* 执行函数 */
        .then(perform => perform(event));
};
const SUBMIT = (reference, config = {}) => (event) => {
    event.preventDefault();
    _submit(reference, config)
    /* 统一 Error 处理 */
        .catch(error => Ajax.ajaxError(reference, error))
};
/*
 * 比 SUBMIT 多一层 redux 的提交
 */
const SUBMIT_REDUX = (reference, config = {}) => (event) => {
    event.preventDefault();
    // $loading设置
    Ut.writeSubmit(reference);

    _submit(reference, config, true)
    /* 统一 Error 处理 */
        .catch(error => Ajax.ajaxError(reference, error, true))
};
const SUBMIT_DIALOG = (reference, config = {}) => (event) => {
    // 外置的 $submitting = true
    const {doSubmitting} = reference.props;
    if (U.isFunction(doSubmitting)) {
        doSubmitting();
    }
    _submit(reference, config)
        .catch(error => Ajax.ajaxError(reference, error))
};
const KEY = (reference, config = {}) => (event) => {
    event.preventDefault();
    // $loading设置
    reference.setState({$loading: true});
    Ut.formSubmit(reference)
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
export default {
    RESET,
    SUBMIT,
    SUBMIT_REDUX,
    SUBMIT_DIALOG,
    KEY,
}