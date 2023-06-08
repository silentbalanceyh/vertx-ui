import __Zo, {_Tree as Tree} from 'zo';

/**
 *
 * ## 「标准」`Ux.treeParentAllIn`
 *
 * 选择当前节点（多个）和这个节点所有父节点。
 *
 * @memberOf module:tree/zodiac
 * @param {Array} keys 被选择的节点的id集合
 * @param {Array} data 将选择的数据源。
 * @param {String} parentField 父字段专用字段名。
 * @return {Array} 返回选择的数组。
 */
const treeParentAllIn = (keys = [], data = [], parentField = "parent") =>
    __Zo.treeParentAllIn(keys, data, parentField);


/**
 *
 * ## 「标准」`Ux.treeParentAll`
 *
 * 选择当前节点的所有父节点（不包含当前）。
 *
 * @memberOf module:tree/zodiac
 * @param {Array} keys 被选择的节点的id集合
 * @param {Array} data 将选择的数据源。
 * @param {String} parentField 父字段专用字段名。
 * @return {Array} 返回选择的数组。
 */
const treeParentAll = (keys = [], data = [], parentField = "parent") =>
    __Zo.treeParentAll(keys, data, parentField);


/**
 *
 * ## 「标准」`Ux.treeParent`
 *
 * 选择当前节点的直接父节点。
 *
 * @memberOf module:tree/zodiac
 * @param {Array} keys 被选择的节点的id集合
 * @param {Array} data 将选择的数据源。
 * @param {String} parentField 父字段专用字段名。
 * @return {Array} 返回选择的数组。
 */
const treeParent = (keys = [], data = [], parentField = "parent") =>
    __Zo.treeParent(keys, data, parentField);


/**
 *
 * ## 「标准」`Ux.treeChildren`
 *
 * 选择当前节点的直接子节点。
 *
 * @memberOf module:tree/zodiac
 * @param {Array} keys 被选择的节点的id集合
 * @param {Array} data 将选择的数据源。
 * @param {String} parentField 父字段专用字段名。
 * @return {Array} 返回选择的数组。
 */
const treeChildren = (keys = [], data = [], parentField = "parent") =>
    __Zo.treeChildren(keys, data, parentField);


/**
 *
 * ## 「标准」`Ux.treeChildrenAll`
 *
 * 选择当前节点的所有子节点（不包含当前）。
 *
 * @memberOf module:tree/zodiac
 * @param {Array} keys 被选择的节点的id集合
 * @param {Array} data 将选择的数据源。
 * @param {String} parentField 父字段专用字段名。
 * @return {Array} 返回选择的数组。
 */
const treeChildrenAll = (keys = [], data = [], parentField = "parent") =>
    __Zo.treeChildrenAll(keys, data, parentField);

/**
 *
 * ## 「标准」`Ux.treeChildrenAllIn`
 *
 * 选择当前节点（多个）和这个节点所有子节点。
 *
 * @memberOf module:tree/zodiac
 * @param {Array} keys 被选择的节点的id集合
 * @param {Array} data 将选择的数据源。
 * @param {String} parentField 父字段专用字段名。
 * @return {Array} 返回选择的数组。
 */
const treeChildrenAllIn = (keys = [], data = [], parentField = "parent") =>
    __Zo.treeChildrenAllIn(keys, data, parentField);


/**
 * ## 「标准」`Ux.treeFlip`
 *
 * 拉平属性配置专用函数，构造树级别的显示信息。
 *
 * @memberOf module:tree/zodiac
 * @param {Array} data 将选择的数据源。
 * @param {Object} config 树配置。
 * @return {Object}　返回对象信息。
 */
const treeFlip = (data = [], config = {}) =>
    __Zo.treeFlip(data, config);


/**
 * ## 「标准」`Ux.treeShared`
 *
 * 求选中节点的最大公约子树相关信息。
 *
 * @memberOf module:tree/zodiac
 * @param {Array} selected 被选中的节点值。
 * @param {Array} treeArray 树状数据源的最原始信息。
 * @param {Object} config 树相关配置，主要包含树字段 parent 和目标字段 target。
 * @return {any} 返回每一个 selected 的最大公约树信息。
 */
const treeShared = (selected = [], treeArray = [], config = {}) =>
    __Zo.treeShared(selected, treeArray, config);

export default {
    // 计算最大公约数
    treeShared,
    // 常用：当前节点 和 所有父节点
    treeParentAllIn,
    // 所有父节点
    treeParentAll,
    // 直接父节点
    treeParent,
    // 直接子节点
    treeChildren,
    // 所有子节点
    treeChildrenAll,
    // 常用：当前节点 和 所有子节点
    treeChildrenAllIn,
    // 拉平构造 $path,
    treeFlip,
    Tree,
    TreeAction: Tree
}