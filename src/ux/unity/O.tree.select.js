import Ele from '../element';
import Abs from '../abyss';
// 常用：当前节点 和 所有父节点
const treeParentAllIn = (keys = [], data = [], parent = "parent") =>
    keys.map(key => Ele.elementBranch(data, key, parent))
        .reduce((previous, current) => previous.concat(current), [])
        .map(item => item.key);
// 所有父节点
const treeParentAll = (keys = [], data = [], parent = "parent") =>
    keys.map(key => Ele.elementBranch(data, key, parent))
        .reduce((previous, current) => previous.concat(current), [])
        .map(item => item.key)
        .filter(item => !Abs.immutable(keys).contains(item));
// 直接父节点
const treeParent = (keys = [], data = []) =>
    keys.map(key => data.filter(each => key === each.key))
        .reduce((previous, current) => previous.concat(current), [])
        .map(item => item.parent);
// 直接子节点
const treeChildren = (keys = [], data = []) =>
    keys.map(key => data.filter(each => key === each.key))
        .reduce((previous, current) => previous.concat(current), [])
        .map(item => data.filter(each => each.parent === item.key))
        .reduce((previous, current) => previous.concat(current), [])
        .map(item => item.key);
// 所有子节点
const treeChildrenAll = (keys = [], data = []) =>
    keys.map(key => data.filter(each => key === each.key))
        .reduce((previous, current) => previous.concat(current), [])
        .map(item => Ele.elementChild(data, item))
        .reduce((previous, current) => previous.concat(current), [])
        .map(item => item.key);
// 常用：当前节点 和 所有子节点
const treeChildrenAllIn = (keys = [], data = []) =>
    keys.concat(keys.map(key => data.filter(each => key === each.key))
        .reduce((previous, current) => previous.concat(current), [])
        .map(item => Ele.elementChild(data, item))
        .reduce((previous, current) => previous.concat(current), [])
        .map(item => item.key)
    );
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
export default {
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
    Tree: {
        CHILDREN_ALL_INCLUDE: treeChildrenAllIn,
        CHILDREN_ALL: treeChildrenAll,
        CHILDREN: treeChildren,
        PARENT: treeParent,
        PARENT_ALL: treeParentAll,
        PARENT_ALL_INCLUDE: treeParentAllIn,
    }
}