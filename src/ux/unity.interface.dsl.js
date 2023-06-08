import __Zo from 'zo';

/**
 * ## 「标准」`Ux.dslArray`
 *
 * Zero UI 中存储 Array 的专用数据，配置数据格式
 *
 * ```json
 * {
 *     field: "主键字段",
 *     remove: "是否 true / false"
 * }
 * ```
 *
 * @memberOf module:deprecated/zodiac
 * @deprecated
 * @param {Object|ReactComponent} reference React组件。
 * @param {String} key 写内容所需的 key
 * @param {Array} data 合并到 reference state 中的数据本身
 * @param {Object} config 配置数据
 */
const dslArray = (reference, key, data = [], config = {}) =>
    __Zo.dslArray(reference, key, data, config);
export default {
    dslArray
}