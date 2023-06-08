import __Zo from 'zo';

/**
 * ## 「标准」`Ux.writeTree`
 *
 * Zero UI中和 redux 连接到一起的状态统一修改函数，主要修改节点为 `out` 根节点下的数据。
 *
 * @memberOf module:write/zodiac
 * @param {Object|ReactComponent} reference React组件。
 * @param {Object} state 被修改的状态信息。
 * @param {any} dft 状态默认值
 */
const writeTree = (reference, state, dft = null) =>
    __Zo.writeTree(reference, state, dft);
/**
 * ## 「标准」`Ux.writeClean`
 *
 * Zero UI 中的 redux 树的清除方法，用于清除该节点上的数据，该清除会清掉默认信息。
 *
 * * `datum.data`。
 * * `datum.menus`。
 * * `datum.inited`。
 * * `assist`。
 * * `state.submitting`.
 *
 * @memberOf module:write/zodiac
 * @param {Object|ReactComponent} reference React组件。
 * @param {Array} keys 被清除的所有节点信息。
 */
const writeClean = (reference, keys = []) =>
    __Zo.writeClean(reference, keys);
/**
 * ## 「标准」`Ux.writeSubmit`
 *
 * Zero UI 中的 redux 树的防重复提交专用方法，用于检查 redux 引擎下的防重复提交。
 *
 * @memberOf module:write/zodiac
 * @param {Object|ReactComponent} reference React组件。
 * @param {boolean} loading 防重复提交专用状态值。
 */
const writeSubmit = (reference, loading = true) =>
    __Zo.writeSubmit(reference, loading);
export default {
    /* 提交书写 */
    writeSubmit,
    /* 写树统一方法 */
    writeTree,
    /* 清空树统一方法 */
    writeClean,
}