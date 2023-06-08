import Ux from 'ux';

const upValue = (state = {}, prevState = {}, key = "") => {
    if ("string" === typeof key) {
        const original = prevState[key];
        const current = state[key];
        if (Ux.isDiff(original, current)) {
            return {original, current};
        }
    }
};
const upCondition = (state = {}, prevState = {}) =>
    upValue(state, prevState, Ux.Env.K_NAME.CONDITION);
const upQuery = (state = {}, prevState = {}) =>
    upValue(state, prevState, Ux.Env.K_NAME.QUERY);
const upLoading = (state = {}, prevState = {}) =>
    upValue(state, prevState, Ux.Env.K_NAME.LOADING);

const upList = (props = {}, prevProps = {}) => {
    const config = props.config ? props.config : {};
    const previous = prevProps.config ? prevProps.config : {};
    /*
     * 移除 component 相关配置信息
     * 1）解决第一次多选闪屏的问题
     * 2）在切换页面的过程中，实际上 component 的改动不重要，因为 component 应该在两种情况彻底更改
     *    - $options 发生变更
     *    - $identifier 发生变更
     * 二者是从属关系，所以在 rxPostSelected 触发时，保证不闪屏，所以不检查 component
     */
    const current = Ux.clone(config);
    const original = Ux.clone(previous);

    if (current.component) delete current.component;
    if (original.component) delete original.component;
    if (Ux.isDiff(original, current)) {
        return {original, current};
    }
};
export default {
    upList,
    upCondition,
    upQuery,
    upValue,
    upLoading,
}