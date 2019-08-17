import Fn from '../functions';
/*
 * 纯 loading
 */
export default (reference, virtualRef) => {
    /*
     * 直接检查 props / state 中的 $loading 是否一致
     */
    const props = reference.props;
    const state = Fn.state(reference, true);
    const original = state.$loading;
    const current = props.$loading;
    if (current && !original) {
        Fn.rsLoading(reference, true)({});
    }
}