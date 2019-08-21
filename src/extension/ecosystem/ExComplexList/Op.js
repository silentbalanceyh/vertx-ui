import Ensurer from './ensurer';
import Init from './state';
import Ex from 'ex';
import Ux from 'ux';

const yiList = (reference) => {
    const {config = {}, /* 基本配置 */} = reference.props;
    const error = Ensurer.verify(reference, config);    /* W01: 验证生成 error */
    if (error) {
        reference.setState({error});                    /* ERROR: 有错误的页面 */
    } else {
        Init
            .sync(reference, config)                                /* W02: 静态状态，来源 config */
            .then(state => Init.async(reference, config, state))    /* W03: 动态状态，来源 远程或其他 */
            .then(state => Init.ready(reference, state))                       /* W04: 处理准备状态 */
            .then(state => reference.setState(state))
    }
};
const yuList = (reference, previous = {}) => {
    const prevProps = previous.prevProps;
    const props = reference.props;
    const $defaultChecked = Ex.upQuery(props, prevProps);
    if ($defaultChecked) {
        const query = Ux.clone($defaultChecked.current);
        /*
         * 修改当前记录中的 query
         */
        reference.setState({query});
    }
};
export default {
    yiList,
    yuList,
}