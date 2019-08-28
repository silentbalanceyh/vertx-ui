import Ux from 'ux';
/*
 * 更新条件处理：
 * 1）判断 key 中是否有变更
 * 2）如果有变更，则同时返回 current, original 的值
 */
const _up = (state = {}, prevState = {}, key = "") => {
    if ("string" === typeof key) {
        const original = prevState[key];
        const current = state[key];
        if (Ux.isDiff(original, current)) {
            return {original, current};
        }
    }
};
const upCondition = (state = {}, prevState = {}) => _up(state, prevState, "$condition");
const upQuery = (state = {}, prevState = {}) => _up(state, prevState, '$query');
const upLoading = (state = {}, prevState = {}) => _up(state, prevState, '$loading');
export default {
    upCondition,
    upQuery,
    upValue: _up,
    upLoading,
}