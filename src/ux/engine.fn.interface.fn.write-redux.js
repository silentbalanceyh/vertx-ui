import __Zo from 'zo';

/**
 * ## 「标准」`Ux.writeAssist`
 *
 * Zero UI 中的 redux 树的辅助数据 `assist` 节点专用方法，用于写 redux 树
 *
 * @memberOf module:write/zodiac
 * @param {Object|ReactComponent} reference React组件。
 * @param {String} key redux树上的 Assist 辅助数据所需的键。
 * @param {Object} data 需要保存的记录集。
 * @param {boolean} isDeleted 该操作是删除还是保存。
 */
const writeAssist = (reference, key, data = {}, isDeleted = false) =>
    __Zo.writeAssist(reference, key, data, isDeleted);
export default {
    writeAssist
}