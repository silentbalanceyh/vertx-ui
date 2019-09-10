import Fn from '../../functions';
import Ux from 'ux';
/*
 * 纯 loading
 */
export default (reference, virtualRef) => {
    /*
     * 直接检查 props / state 中的 $loading 是否一致
     */
    const props = reference.props;
    const state = Ux.clone(reference.state);
    const original = state.$loading;
    const current = props.$loading;
    if (current && !original) {
        Fn.rsLoading(reference, true)({});
    }
}