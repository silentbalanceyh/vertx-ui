import __TS from './tree.fn.tree.selection';

/**
 * 专用树选择类核心方法
 *
 * Ox中配置专用的树相关信息，如果是在 Ox 配置和数据驱动的应用程序中，可直接使用，内部使用代码如下：
 *
 * ```js
 * const onTree = (keys = [], data = [], config = {}) => {
 *      const source = Ux.toTreeArray(data, config.tree);
 *      let treeArray = [];
 *      if (config.mode) {
 *          // 执行选择方法 Tree[xxx]
 *          const fun = Ux.Tree[config.mode];
 *          if (U.isFunction(fun)) {
 *              const result = fun(keys, source);
 *              const $result = Ux.immutable(result);
 *              treeArray = data.filter(each => $result.contains(each.key));
 *          }
 *      }
 *      return treeArray;
 *  };
 * ```
 *
 * 如果是开发模式则直接使用 `Ux.treeXX` 系列的Api相关信息。
 *
 * @name zodiac.Tree
 * @class Tree
 */
class Tree {
    /**
     * ## 标准函数
     *
     * 选择当前节点（多个）和这个节点所有子节点。
     *
     * @param {Array} keys 被选择的节点的id集合
     * @param {Array} data 将选择的数据源。
     * @param {String} parentField 父字段专用字段名。
     * @return {Array} 返回选择的数组。
     */
    static CHILDREN_ALL_INCLUDE(keys = [], data = [], parentField = "parent") {
        return __TS.treeChildrenAllIn(keys, data, parentField);
    }

    /**
     * ## 标准函数
     *
     * 选择当前节点的所有子节点（不包含当前节点）。
     *
     * @param {Array} keys 被选择的节点的id集合
     * @param {Array} data 将选择的数据源。
     * @param {String} parentField 父字段专用字段名。
     * @return {Array} 返回选择的数组。
     */
    static CHILDREN_ALL(keys = [], data = [], parentField = "parent") {
        return __TS.treeChildrenAll(keys, data, parentField);
    }

    /**
     * ## 标准函数
     *
     * 选择当前节点的直接子节点。
     *
     * @param {Array} keys 被选择的节点的id集合
     * @param {Array} data 将选择的数据源。
     * @param {String} parentField 父字段专用字段名。
     * @return {Array} 返回选择的数组。
     */
    static CHILDREN(keys = [], data = [], parentField = "parent") {
        return __TS.treeChildren(keys, data, parentField);
    }

    /**
     * ## 标准函数
     *
     * 选择当前节点的直接父节点。
     *
     * @param {Array} keys 被选择的节点的id集合
     * @param {Array} data 将选择的数据源。
     * @param {String} parentField 父字段专用字段名。
     * @return {Array} 返回选择的数组。
     */
    static PARENT(keys = [], data = [], parentField = "parent") {
        return __TS.treeParent(keys, data, parentField);
    }

    /**
     * ## 标准函数
     *
     * 选择当前节点的所有父节点（不包含当前节点）
     *
     * @param {Array} keys 被选择的节点的id集合
     * @param {Array} data 将选择的数据源。
     * @param {String} parentField 父字段专用字段名。
     * @return {Array} 返回选择的数组。
     */
    static PARENT_ALL(keys = [], data = [], parentField = "parent") {
        return __TS.treeParentAll(keys, data, parentField);
    }

    /**
     * ## 标准函数
     *
     * 选择当前节点（多个）和这个节点所有父节点。
     *
     * @param {Array} keys 被选择的节点的id集合
     * @param {Array} data 将选择的数据源。
     * @param {String} parentField 父字段专用字段名。
     * @return {Array} 返回选择的数组。
     */
    static PARENT_ALL_INCLUDE(keys = [], data = [], parentField = "parent") {
        return __TS.treeParentAllIn(keys, data, parentField);
    }
}

export default Tree