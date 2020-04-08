import Fn from '../../functions';
import Ux from 'ux';

/**
 * ## 扩展函数
 *
 * 直接执行纯的 $loading，检查当前属性 props 和 state 中的 loading 是否变化。
 *
 * 1. props 中的 $loading：外置传入
 * 2. state 中的 $loading：内置传入
 *
 * @memberOf module:_channel
 * @method yuLoading
 * @param {ReactComponent} reference React对应组件引用
 * @param {Object} virtualRef 旧的属性和状态
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