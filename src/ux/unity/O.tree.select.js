import Ele from '../element';
import Abs from '../abyss';
import T from './O.plugin.element';

/**
 *
 * ## 「标准」`Ux.treeParentAllIn`
 *
 * 选择当前节点（多个）和这个节点所有父节点。
 *
 * @memberOf module:_unity
 * @param {Array} keys 被选择的节点的id集合
 * @param {Array} data 将选择的数据源。
 * @param {String} parentField 父字段专用字段名。
 * @return {Array} 返回选择的数组。
 */
const treeParentAllIn = (keys = [], data = [], parentField = "parent") =>
    keys.map(key => Ele.elementBranch(data, key, parentField))
        .reduce((previous, current) => previous.concat(current), [])
        .map(item => item.key);


/**
 *
 * ## 「标准」`Ux.treeParentAll`
 *
 * 选择当前节点的所有父节点（不包含当前）。
 *
 * @memberOf module:_unity
 * @param {Array} keys 被选择的节点的id集合
 * @param {Array} data 将选择的数据源。
 * @param {String} parentField 父字段专用字段名。
 * @return {Array} 返回选择的数组。
 */
const treeParentAll = (keys = [], data = [], parentField = "parent") =>
    keys.map(key => Ele.elementBranch(data, key, parentField))
        .reduce((previous, current) => previous.concat(current), [])
        .map(item => item.key)
        .filter(item => !Abs.immutable(keys).contains(item));


/**
 *
 * ## 「标准」`Ux.treeParent`
 *
 * 选择当前节点的直接父节点。
 *
 * @memberOf module:_unity
 * @param {Array} keys 被选择的节点的id集合
 * @param {Array} data 将选择的数据源。
 * @param {String} parentField 父字段专用字段名。
 * @return {Array} 返回选择的数组。
 */
const treeParent = (keys = [], data = [], parentField = "parent") =>
    keys.map(key => data.filter(each => key === each.key))
        .reduce((previous, current) => previous.concat(current), [])
        .map(item => item[parentField]);


/**
 *
 * ## 「标准」`Ux.treeChildren`
 *
 * 选择当前节点的直接子节点。
 *
 * @memberOf module:_unity
 * @param {Array} keys 被选择的节点的id集合
 * @param {Array} data 将选择的数据源。
 * @param {String} parentField 父字段专用字段名。
 * @return {Array} 返回选择的数组。
 */
const treeChildren = (keys = [], data = [], parentField = "parent") =>
    keys.map(key => data.filter(each => key === each.key))
        .reduce((previous, current) => previous.concat(current), [])
        .map(item => data.filter(each => each[parentField] === item.key))
        .reduce((previous, current) => previous.concat(current), [])
        .map(item => item.key);


/**
 *
 * ## 「标准」`Ux.treeChildrenAll`
 *
 * 选择当前节点的所有子节点（不包含当前）。
 *
 * @memberOf module:_unity
 * @param {Array} keys 被选择的节点的id集合
 * @param {Array} data 将选择的数据源。
 * @param {String} parentField 父字段专用字段名。
 * @return {Array} 返回选择的数组。
 */
const treeChildrenAll = (keys = [], data = [], parentField = "parent") =>
    keys.map(key => data.filter(each => key === each.key))
        .reduce((previous, current) => previous.concat(current), [])
        .map(item => T.elementChildren(data, item, parentField))
        .reduce((previous, current) => previous.concat(current), [])
        .map(item => item.key);


/**
 *
 * ## 「标准」`Ux.treeChildrenAllIn`
 *
 * 选择当前节点（多个）和这个节点所有子节点。
 *
 * @memberOf module:_unity
 * @param {Array} keys 被选择的节点的id集合
 * @param {Array} data 将选择的数据源。
 * @param {String} parentField 父字段专用字段名。
 * @return {Array} 返回选择的数组。
 */
const treeChildrenAllIn = (keys = [], data = [], parentField = "parent") =>
    keys.concat(keys.map(key => data.filter(each => key === each.key))
        .reduce((previous, current) => previous.concat(current), [])
        .map(item => T.elementChildren(data, item, parentField))
        .reduce((previous, current) => previous.concat(current), [])
        .map(item => item.key)
    );


/**
 * ## 「标准」`Ux.treeFlip`
 *
 * 拉平属性配置专用函数，构造树级别的显示信息。
 *
 * @memberOf module:_unity
 * @param {Array} data 将选择的数据源。
 * @param {Object} config 树配置。
 * @return {Object}　返回对象信息。
 */
const treeFlip = (data = [], config = {}) => {
    const {
        parent = 'parent',  // 构造树的父字段
        divider = '/',      // 拉平的分隔符
        keyField,           // 拉平过后的 key 字段
    } = config;
    const $path = {};
    if (keyField && "string" === typeof keyField) {
        let $category = Abs.clone(data);
        data.forEach(each => {
            const keyValue = each[keyField];
            if (keyValue) {
                $path[keyValue] = treeParentAllIn([each.key], $category, parent)
                    .map(key => Ele.elementUnique(data, "key", key))
                    .filter(record => !!record)
                    .map(record => record.name)
                    .join(divider);
            }
        });
    }
    return $path;
};


/**
 * ## 「标准」`Ux.treeShared`
 *
 * 求选中节点的最大公约子树相关信息。
 *
 * @memberOf module:_unity
 * @param {Array} selected 被选中的节点值。
 * @param {Array} treeArray 树状数据源的最原始信息。
 * @param {Object} config 树相关配置，主要包含树字段 parent 和目标字段 target。
 * @return {any} 返回每一个 selected 的最大公约树信息。
 */
const treeShared = (selected = [], treeArray = [], config = {}) => {
    const {
        parent = "parent",
        target = "key"
    } = config;
    const matrix = selected
        .map(key => treeParentAllIn([key], treeArray, parent))
        .map(keys => keys.map(each => Ele.elementUnique(treeArray, "key", each))
            .filter(each => undefined !== each)
            .map(each => each[target])
        );
    /*
     * 逆序处理
     */
    let length = Math.min.apply(null, matrix.map(each => each.length));
    let selectedValue = null;
    for (let idx = (length - 1); idx >= 0; idx--) {
        const vertical = matrix.map(item => item[idx]);
        const value = {};
        vertical.forEach(each => value[each] = true);
        if (1 === Object.keys(value).length) {
            selectedValue = vertical[0];
            break;
        }
    }
    return selectedValue;
};

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
        return treeChildrenAllIn(keys, data, parentField);
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
        return treeChildrenAll(keys, data, parentField);
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
        return treeChildren(keys, data, parentField);
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
        return treeParent(keys, data, parentField);
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
        return treeParentAll(keys, data, parentField);
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
        return treeParentAllIn(keys, data, parentField);
    }
}

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
    Tree
}