/*
 * 将数组转换成树的标准方法
 * 1）树形菜单
 * 2）TreeSelect中的选项
 * 3）可配置
 * 4）数据源可以是 datum 中的配置
 * 树的配置基于 X_CATEGORY 表的结构执行，默认值：
 * {
 *     key: "key",
 *     parent: "parentId",
 *     value: "key",
 *     text: "text",
 *     title: "text",
 *     sort: "sort",
 *     level: "level"
 * }
 */
import __Zo from 'zo';

/**
 * ## 「标准」`Ux.toTreeConfig`
 *
 * 针对树形配置执行规范化处理，处理过后的数据结构如：
 *
 * ```json
 * {
 *     key: "树上的每个节点的主键字段",
 *     parent: "树上构造整个树的节点时的父节点字段",
 *     value: "树节点每个节点的值",
 *     text: "树节点每个节点显示文字",
 *     title: "树节点每个节点标题",
 *     sort: "树节点的排序字段",
 *     leaf: "当前树节点是否叶节点的检查字段",
 *     level: "当前节点的level字段，也可以直接计算",
 *     root: "根节点从哪一级开始，默认从1",
 * }
 * ```
 *
 * @memberOf module:to/zodiac
 * @param {Object} config 传入的原始树配置。
 * @returns {Object} 返回合法的树配置对象。
 */
const toTreeConfig = (config = {}) =>
    __Zo.toTreeConfig(config);


/**
 * ## 「标准」`Ux.toTreeArray`
 *
 * 构造树形数组，每个元素都是一个平行节点，核心结构：
 *
 * ```json
 * {
 *     "data": {
 *         "...": "原始数据"
 *     },
 *     key: "树上的每个节点的主键字段",
 *     parent: "树上构造整个树的节点时的父节点字段",
 *     value: "树节点每个节点的值",
 *     text: "树节点每个节点显示文字",
 *     title: "树节点每个节点标题",
 *     sort: "树节点的排序字段",
 *     leaf: "当前树节点是否叶节点的检查字段",
 *     level: "当前节点的level字段，也可以直接计算",
 *
 *     disabled: "是否禁用，提取属性",
 *     isLeaf: "提取叶节点属性",
 *     selectable: "是否可选中，提取属性",
 *     className: "风格Css 对应的类名",
 *     title: "标题",
 *     icon: "图标"
 * }
 * ```
 *
 * 最终数据结构两层，用于很多地方的树处理，在构造树的过程中每个节点都会包含这些基础属性，而原始记录存在于`data`节点。
 *
 * @memberOf module:to/zodiac
 * @param {Array} data 输入数组数据。
 * @param {Object} config 传入的树配置。
 * @return {Array} 返回最终的树形数组。
 */
const toTreeArray = (data = [], config = {}) =>
    __Zo.toTreeArray(data, config);


/**
 * ## 「标准」`Ux.toTree`
 *
 * 整个树的每一个节点会包含 `children` 的叶节点信息，一个节点可能包含多个叶节点，顶层数组只包括顶层父类数组。
 *
 * @memberOf module:to/zodiac
 * @param {Array} data 输入数组数据。
 * @param {Object} config 传入的树配置。
 * @return {Array} 返回标准树桩结构。
 */
const toTree = (data = [], config = {}) =>
    __Zo.toTree(data, config);
/**
 * ## 「标准」`Ux.toTreeTextArray`
 *
 * @memberOf module:to/zodiac
 * @param textArr
 * @returns {*}
 */
const toTreeTextArray = (textArr = []) =>
    __Zo.toTreeTextArray(textArr);
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    toTree,
    toTreeConfig,
    toTreeArray,
    toTreeTextArray,
}