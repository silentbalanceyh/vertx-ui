import Ut from '../../unity';
import Ajax from '../../ajax';
import Cmn from './I.common';
import Abs from '../../abyss';

const RESET = (reference, config = {}) => (event) => {
    event.preventDefault();
    Ut.formReset(reference);
    Cmn.performFn(reference, config)
    /* 执行函数 */
        .then(perform => perform(event));
};
const SUBMIT = (reference, config = {}) => (event) => {
    event.preventDefault();
    // $loading设置
    reference.setState({$loading: true});
    Ut.formSubmit(reference)
    /* Performer */
        .then(data => Cmn.performFn(reference, config)
            /* 记得拷贝数据传入 perform，否则 data 无法被扩展 */
                .then(perform => perform(data))
        )
        /* 统一 Error 处理 */
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
    KEY,
}