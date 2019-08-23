import Ux from 'ux';
import Ex from 'ex';

const yuPage = (reference, previous = {}) => {
    /*
     * 当前和原始
     */
    const {$router} = reference.props;
    const prevProps = previous.prevProps;
    const $prevRt = prevProps.$router;
    /*
     * 两个改变
     */
    const current = $router.params();
    const original = $prevRt.params();
    if (Ux.isDiff(current, original)) {
        /*
         * 更新状态处理
         */
        Ex.yiTabular(reference);
    }
};
export default {
    yuPage
}