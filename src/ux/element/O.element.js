import Abs from '../abyss';
import E from '../error';
import U from 'underscore';

/**
 * ## 标准函数
 *
 * 数组索引查找元素，查找 field = value 的索引专用
 *
 * 1）查找1：传入了 field，直接查找 field = value 的元素所在的 index
 * 2）查找2：未传入 field，直接查找值（纯数组）
 *
 * @memberOf module:_element
 * @param {Array} array 被查找的数组
 * @param {String} field 字段名
 * @param {any} value 字段值
 * @returns {Number} 找到的索引
 */
const elementIndex = (array = [], value, field) => {
    let foundIndex = -1;
    array.forEach((each, index) => {
        if (field) {
            /* 第一种查找 */
            if (value === each[field]) {
                foundIndex = index;
            }
        } else {
            /* 第二种查找 */
            if (value === each) {
                foundIndex = index;
            }
        }
    });
    return foundIndex;
}
/**
 * ## 标准函数
 *
 * 数组元素交换元素，将两个元素交换位置专用
 *
 * @memberOf module:_element
 * @param {Array} array 输入的数组信息。
 * @param {Number} fromIndex 交换的开始索引
 * @param {Number} toIndex 交换的结束索引
 * @return {Array} 返回原始数组引用
 */
const elementWrap = (array = [], fromIndex, toIndex) => {
    let from = array[fromIndex];
    if (from) {
        from = Abs.clone(from);
    }
    let to = array[toIndex];
    if (to) {
        to = Abs.clone(to);
    }
    if (from && to) {
        array[fromIndex] = to;
        array[toIndex] = from;
    }
    return array;
}
/**
 * ## 标准函数
 *
 * 数组元素拉平函数，将一个完整的树拉平成不带树结构的数据。
 *
 * @deprecated 由于目前只在 Uarr 中使用，所以将来可能被废弃。
 * @memberOf module:_element
 * @param {Array} array 输入的数组信息。
 * @param {String} field 需要拉平的字段信息
 * @param {boolean} parent 是否包含父数组
 * @return {Array} 返回拉平后的数组
 */
const elementFlat = (array = [], field = "", parent = false) => {
    const result = parent ? Abs.clone(array) : [];
    array.forEach(item => {
        /*
         * 查找子节点、并且将子节点拉平到当前节点，执行合并
         * 1. 移除原始的 field。
         * 2. 创建 _parent 和 key 之间的关系。
         */
        const fnChildren = (children = []) => U.isArray(children) ?
            children.forEach(child => {
                let target = Abs.immutable(item);
                target = target.mergeDeep(child);
                target = target.remove(field);
                const $target = target.toJS();
                if (item.key) $target._parent = item.key;
                result.push($target);
            }) : {};
        /*
         * 如果属性是 Array，则直接处理
         */
        if (item[field] && Array.prototype.isPrototypeOf(item[field])) {
            const children = item[field];
            fnChildren(children);
        } else if (0 <= field.indexOf('.')) {
            const splitted = field.split('.');
            // 只支持一级跳跃处理数组
            if (2 === splitted.length) {
                const hitted = item[splitted[0]];
                if (U.isArray(hitted)) {
                    // 如果是数组
                    hitted.forEach(hit => {
                        const children = hit[splitted[1]];
                        fnChildren(children);
                    });
                } else if (U.isObject(hitted)) {
                    // 如果是对象
                    const children = hitted[splitted[1]];
                    fnChildren(children);
                }
            }
        }
    });
    return result;
};
/**
 * ## 标准函数
 *
 * 在数组中查找唯一元素
 *
 * 1. 查找条件为`field = value`。
 * 2. 目前只支持单字段查找，查找到多个则直接返回第一个。
 *
 * 框架内的调用如
 *
 * ```js
 *     const found = Ux.elementUnique(nodes, 'identifier', identifier);
 * ```
 *
 * @memberOf module:_element
 * @param {Array} array 输入的数组信息。
 * @param {String} field 查找的字段名。
 * @param {any} value 作为条件的字段值。
 * @returns {Object} 返回最终查找到的唯一元素Object。
 */
const elementUnique = (array = [], field = "", value) => {
    E.fxTerminal(!U.isArray(array), 10071, array, "Array");
    let reference = [];
    if (U.isObject(field)) {
        // Filter模式
        reference = elementFind(array, field);
    } else {
        reference = array.filter(item => value === item[field]);
    }
    E.fxTerminal(1 < reference.length, 10069, reference, 1);
    return 0 === reference.length ? undefined : reference[0];
};
/**
 * ## 标准函数
 *
 * 针对数组的查找操作，查找符合 filters 条件的数组，内部使用该函数的代码
 *
 * ```js
 * const _g6Find = ($data = [], identifier) => {
 *      const found = Ele.elementFind($data, {identifier});
 *      if (1 === found.length) {
 *          return found[0];
 *      } else {
 *          const filter = found.filter(item => item.leaf); // 叶节点优先
 *          if (1 === filter.length) {
 *              return filter[0];
 *          }
 *      }
 * };
 * ```
 *
 * @memberOf module:_element
 * @param {Array} array 输入的数组信息。
 * @param {Object} filters 过滤专用键值对。
 * @return {Array} 返回查找到的数组信息，最终结果也是一个`[]`。
 */
const elementFind = (array = [], filters) => {
    E.fxTerminal(!U.isArray(array), 10071, array, "Array");
    let reference = array;
    if (filters) {
        // eslint-disable-next-line
        for (const field in filters) {
            if (filters.hasOwnProperty(field)) {
                // 这里用双等号匹配，用于检查字符串和数值的比较
                reference = reference.filter(item => {
                    const value = filters[field];
                    if (U.isArray(value)) {
                        const $value = Abs.immutable(value);
                        return $value.contains(item[field]);
                    } else {
                        return item[field] === value;
                    }
                });
            }
        }
    }
    return reference;
};
/**
 * ## 标准函数
 *
 * 针对数组执行映射操作，将垂直映射过的值合并成一个无重复元素的集合。
 *
 * ```js
 * const user = [
 *     {name:"lang1", email":"silentbalanceyh@126.com"},
 *     {name:"lang2", type:"employee"},
 *     {name:"lang3", type:"user"},
 *     {name:"lang4", type:"user"}
 * ]
 * const mapped = Ux.elementVertical(user, "type");
 * // 最终计算的值
 * // mapped = ["user", "employee"]
 * // 映射最终结果是一个 Array（无重复记录）
 * ```
 *
 * @memberOf module:_element
 * @param {Array} array 输入的数组信息
 * @param {String} field 执行映射的字段名
 * @return {Array} 新字段值构造的最终集合
 */
const elementVertical = (array = [], field = "") => {
    E.fxTerminal(!U.isArray(array), 10071, array, "Array");
    let result = [];
    array.forEach(item => {
        if (item[field]) {
            const $result = Abs.immutable(result);
            if (!$result.contains(item[field])) {
                result.push(item[field]);
            }
        }
    });
    return result;
};
/**
 * ## 标准函数「Zero」
 *
 * Zero UI中的树函数，从当前节点查找整个节点所在的分支数组（父节点、父父节点、…… 顶层祖辈），`elementBranch` 和 `elementChild` 为互逆函数。
 *
 * 1. 每个节点的默认主键字段为`key`。
 * 2. 计算父节点可透过`parentField`传入，传入的`parentField`表示父节点字段。
 *
 * @memberOf module:_element
 * @param {Array} array 输入的数组信息。
 * @param {any} leafValue 被检索的子节点的值。
 * @param {String} parentField 检索树的父字段信息。
 * @return {Array} 返回分支的数组。
 */
const elementBranch = (array = [], leafValue, parentField = "parent") => {
    // 查找的最终结果
    let branch = [];
    // 查找子节点
    const obj = elementUnique(array, "key", leafValue);
    if (obj) {
        const target = Abs.clone(obj);//
        branch.push(target);
        // 查找父节点
        const pid = obj[parentField];
        branch = [].concat(elementBranch(array, pid, parentField)).concat(branch);
    }
    // console.info(found.map(item => elementUnique(array, "key", item)));
    return branch;
};
/**
 * ## 标准函数「Zero」
 *
 * Zero UI中的树函数，在数组中查找当前节点的所有子节点信息，并且构成子树，`elementBranch` 和 `elementChild` 为互逆函数。
 *
 * 1. 计算父节点可透过`parentField`传入，传入的`parentField`表示父节点字段。
 * 2. 每个节点中有两个固定值
 *      1. key 表示每个节点的主键。
 *      2. children 表示每个节点中的子节点信息`[]`。
 * 3. 在每个节点中计算出 `_level` 参数表示生成树中每个节点所在树的`层级`。
 *
 * @memberOf module:_element
 * @param {Array} array 输入的数组信息。
 * @param {Object} current 目标节点。
 * @param {String} parentField 执行树搜索中的父字段。
 * @return {Array} 返回子节点数组
 */
const elementChildTree = (array = [], current = {}, parentField = "parent") => {
    const parentKey = current.key;
    if (!current._level) {
        current._level = 1;
    }
    let children = array
        .filter(each => each[parentField] === parentKey)
        .sort((left, right) => left.sort - right.sort);
    if (0 < children.length) {
        children.forEach(child => {
            child._level = current._level + 1;
            child.children = elementChildTree(array, child, parentField)
        });
    }
    return children;
};
/**
 * ## 标准函数「Zero」
 *
 * Zero UI中的树函数，在数组中查找当前节点的所有子节点，构成子列表（不是子树）。
 *
 * 1. 计算父节点可透过`parentField`传入，传入的`parentField`表示父节点字段。
 * 2. 每个节点中有两个固定值
 *      1. key 表示每个节点的主键。
 *      2. children 表示每个节点中的子节点信息`[]`。
 * 3. 在每个节点中计算出 `_level` 参数表示生成树中每个节点所在树的`层级`。
 *
 * @memberOf module:_element
 * @param {Array} array 输入的数组信息。
 * @param {Object} current 目标节点。
 * @param {String} parentField 执行树搜索中的父字段。
 * @return {Array} 返回子节点数组
 */
const elementChildren = (array = [], current = {}, parentField = "parent") => {
    /*
     * 构造 Children 的树
     */
    const childrenTree = elementChildTree(array, current, parentField);
    /*
     * 只查找 children，不包含当前节点
     */
    const fnChildren = (item = {}) => {
        let children = [];
        if (item.children && 0 < item.children.length) {
            children = children.concat(item.children);
            item.children.forEach(each => {
                const found = fnChildren(each);
                children = children.concat(found);
            });
        }
        return children;
    }
    const result = [];
    childrenTree.forEach(child => {
        result.push(child);
        const foundArray = fnChildren(child);
        if (foundArray && 0 < foundArray.length) {
            foundArray.forEach(eachFound => result.push(eachFound));
        }
    });
    return result;
}
/**
 *
 * ## 标准函数
 *
 * 按照某个字段对这个数组进行分组操作。
 *
 * ```js
 *
 * const input = [
 *      {"name": "lang", type: "user"},
 *      {"name": "lang2", type: "employee"},
 *      {"name": "lang3", type: "employee"}
 * ]
 * const grouped = Ux.elementGroup(input, "type");
 * ```
 *
 * 最终计算出来的`grouped`的数据结构如下：
 *
 * ```json
 * {
 *     "user": [
 *         {"name": "lang", type: "user"}
 *     ],
 *     "employee: [
 *         {"name": "lang2", type: "employee"},
 *         {"name": "lang3", type: "employee"}
 *     ]
 * }
 * ```
 *
 * @memberOf module:_element
 * @param {Array} array 输入的数组
 * @param {String} field 分组专用的字段信息
 * @return {Object} 分组过后每一个键值对为`key = Array`
 */
const elementGroup = (array = [], field) => {
    let result = {};
    if (0 < array.length) {
        let $result = Abs.immutable(array).groupBy(item => item.get(field));
        if ($result) {
            result = $result.toJS();
        }
    }
    return result;
};
export default {
    elementFlat,
    elementWrap,
    elementIndex,
    elementUnique,
    elementFind,
    elementVertical,
    elementGroup,
    // 树操作
    elementBranch,
    elementChildTree,
    elementChildren
}