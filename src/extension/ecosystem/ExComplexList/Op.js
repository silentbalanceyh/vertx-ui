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
        return Init
            .sync(reference, config)                                /* W02: 静态状态，来源 config */
            .then(state => Init.async(reference, config, state))    /* W03: 动态状态，来源 远程或其他 */
            .then(state => Init.ready(reference, state))                       /* W04: 处理准备状态 */
    }
};
const yuList = (reference, previous = {}) => {
    /*
     * 默认 $query 变量的修改（外置传入）
     */
    const prevProps = previous.prevProps;
    const props = reference.props;
    /*
     * 配置优先考虑
     */
    const $configChecked = Ex.upValue(props, prevProps, "config");
    if ($configChecked) {
        /*
         * 默认的 配置处理
         */
        reference.setState({$ready: false});
        Ux.toLoading(() =>
            yiList(reference)
                .then(state => {
                    /*
                     * 更新状态
                     */
                    reference.setState(Ux.clone(state));
                }))
    } else {
        const $queryChecked = Ex.upQuery(props, prevProps);
        if ($queryChecked) {
            /*
             * 修改当前记录中的 query
             */
            const updatedState = {};
            updatedState.query = Ux.clone($queryChecked.current);
            reference.setState(updatedState);
        }
    }
};
export default {
    yiList,
    yuList,
}