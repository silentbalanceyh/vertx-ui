import Ux from 'ux';

/**
 * ## 扩展函数
 *
 * 检查输入的 `key` 状态信息，计算最终状态值：
 *
 * ```json
 * {
 *     original: "原始状态",
 *     current: "新状态"
 * }
 * ```
 *
 * @memberOf module:_up
 * @method upValue
 * @param {State} state 当前状态
 * @param {State} prevState 之前状态
 * @param {String} key 状态值
 * @returns {{current, original}}
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
/**
 * ## 扩展函数
 *
 * 检查 `$condition` 状态信息，计算最终状态值：
 *
 * ```json
 * {
 *     original: "原始状态",
 *     current: "新状态"
 * }
 * ```
 *
 * @memberOf module:_up
 * @param {State} state 当前状态
 * @param {State} prevState 之前状态
 * @returns {Object} 返回计算后的状态信息
 */
const upCondition = (state = {}, prevState = {}) => _up(state, prevState, "$condition");
/**
 *
 * ## 扩展函数
 *
 * 检查 `$query` 状态信息，计算最终状态值：
 *
 * ```json
 * {
 *     original: "原始状态",
 *     current: "新状态"
 * }
 * ```
 *
 * @memberOf module:_up
 * @param {State} state 当前状态
 * @param {State} prevState 之前状态
 * @returns {Object} 返回计算后的状态信息
 */
const upQuery = (state = {}, prevState = {}) => _up(state, prevState, '$query');
/**
 *
 * ## 扩展函数
 *
 * 检查 `$loading` 状态信息，计算最终状态值：
 *
 * ```json
 * {
 *     original: "原始状态",
 *     current: "新状态"
 * }
 * ```
 *
 * @memberOf module:_up
 * @param {State} state 当前状态
 * @param {State} prevState 之前状态
 * @returns {Object} 返回计算后的状态信息
 */
const upLoading = (state = {}, prevState = {}) => _up(state, prevState, '$loading');
/**
 *
 * ## 扩展函数
 *
 * 检查 `$options, $identifier` 状态信息，计算最终状态值：
 *
 * ```json
 * {
 *     original: "原始属性",
 *     current: "新属性"
 * }
 * ```
 *
 *
 * 移除 component 相关配置信息
 *
 * 1. 解决第一次多选闪屏的问题
 * 2. 在切换页面的过程中，实际上 component 的改动不重要，因为 component 应该在两种情况彻底更改
 *    * $options 发生变更
 *    * $identifier 发生变更
 *
 * 二者是从属关系，所以在 rxPostSelected 触发时，保证不闪屏，所以不检查 component
 *
 * @memberOf module:_up
 * @param {Props} props 当前树形
 * @param {Props} prevProps 之前树形
 * @returns {Object} 返回计算后的状态信息
 */
const upList = (props = {}, prevProps = {}) => {
    const config = props.config;
    const previous = prevProps.config;
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
    upCondition,
    upQuery,
    upValue: _up,
    upList,
    upLoading,
}