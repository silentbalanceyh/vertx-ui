import Ensurer from './ensurer';
import Init from './state';

const _yiReady = (state = {}) => {
    state.$submitting = false;
    state.$loading = false;
    state.$ready = true;
    return new Promise((resolve) => resolve(state));
};

const yiList = (reference) => {
    const {config = {}, /* 基本配置 */} = reference.props;
    const error = Ensurer.verify(reference, config);    /* W01: 验证生成 error */
    if (error) {
        reference.setState({error});                    /* ERROR: 有错误的页面 */
    } else {
        Init
            .sync(reference, config)                                /* W02: 静态状态，来源 config */
            .then(state => Init.async(reference, config, state))    /* W03: 动态状态，来源 远程或其他 */
            .then(state => _yiReady(state))                         /* W04: 处理准备状态 */
            .then(state => reference.setState(state))
    }
};
export default {
    yiList
}