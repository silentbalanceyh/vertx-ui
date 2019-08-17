import Ux from 'ux';
import G from '../../functions/global/datum';

const _state = (reference, state = {}) => {
    /*
     * Fix: 如果 newState 直接调用 Object.assign，会导致原始的状态被更改
     * 这种情况下, prevState 和 state 会变得一致，那么 componentDidUpdate
     * 就不会受到影响了，这里不使用这种操作会导致 update 失效
     */
    let newState = G.state(reference, true);
    if (!Ux.isEmpty(state)) {
        Object.assign(newState, state);
    }
    return newState;
};

const _loading = (reference, state = {}) => {
    const newState = _state(reference, {
        ...state,
        $loading: true,  // 加载
    });
    reference.setState(newState);
};
const _loaded = (reference, state = {}) => {
    const newState = _state(reference, {
        ...state,
        $loading: false, // 加载完成
    });
    reference.setState(newState);
};
/*
 * Fn.ko(reference).loading(...): 用于加载，默认带有 $loading = true 专用
 */
export default (reference) => ({
    loading: (state = {}) => _loading(reference, state),
    loaded: (state = {}) => _loaded(reference, state)
});