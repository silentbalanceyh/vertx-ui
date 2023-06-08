import __Zo from 'zo';

/**
 * ## 「引擎」`Ux.forestGroup`
 *
 * 转换成树组（启动连接功能）
 *
 * @memberOf module:tree/zodiac
 * @param {Array} input 输入的完整节点信息
 * @param {Object} group 最终换的组信息
 * @param {Promise<T>} supplier 构造子组数据专用的函数
 * @returns {Object} 返回构造好的 group 信息
 */
const forestGroup = (input = [], group = {}, supplier) =>
    __Zo.forestGroup(input, group, supplier);
/**
 * ## 「引擎」`Ux.forest`
 *
 * 转换成森林数组，将所有的数组全部连接起来形成多叉树结构。
 *
 * @memberOf module:tree/zodiac
 * @param {Array} input 输入的完整节点信息
 * @param {Object} config 基本配置信息
 * @param {Object} group 组相关信息
 * @returns {Object} 返回构造好的 group 信息
 */
const forest = (input = [], config = {}, group = {}) =>
    __Zo.forest(input, config, group);
export default {
    forest,
    forestGroup
}