import __Zn from './zero.module.dependency';

const treeParentAllIn = (keys = [], data = [], parentField = "parent") =>
    keys.map(key => __Zn.elementBranch(data, key, parentField))
        .reduce((previous, current) => previous.concat(current), [])
        .map(item => item.key);


const treeParentAll = (keys = [], data = [], parentField = "parent") =>
    keys.map(key => __Zn.elementBranch(data, key, parentField))
        .reduce((previous, current) => previous.concat(current), [])
        .map(item => item.key)
        .filter(item => !keys.includes(item));


const treeParent = (keys = [], data = [], parentField = "parent") =>
    keys.map(key => data.filter(each => key === each.key))
        .reduce((previous, current) => previous.concat(current), [])
        .map(item => item[parentField]);

const treeChildren = (keys = [], data = [], parentField = "parent") =>
    keys.map(key => data.filter(each => key === each.key))
        .reduce((previous, current) => previous.concat(current), [])
        .map(item => data.filter(each => each[parentField] === item.key))
        .reduce((previous, current) => previous.concat(current), [])
        .map(item => item.key);


const treeChildrenAll = (keys = [], data = [], parentField = "parent") =>
    keys.map(key => data.filter(each => key === each.key))
        .reduce((previous, current) => previous.concat(current), [])
        .map(item => __Zn.elementChildren(data, item, parentField))
        .reduce((previous, current) => previous.concat(current), [])
        .map(item => item.key);

const treeChildrenAllIn = (keys = [], data = [], parentField = "parent") =>
    keys.concat(keys.map(key => data.filter(each => key === each.key))
        .reduce((previous, current) => previous.concat(current), [])
        .map(item => __Zn.elementChildren(data, item, parentField))
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
        let $category = __Zn.clone(data);
        data.forEach(each => {
            const keyValue = each[keyField];
            if (keyValue) {
                $path[keyValue] = treeParentAllIn([each.key], $category, parent)
                    .map(key => __Zn.elementUnique(data, "key", key))
                    .filter(record => !!record)
                    .map(record => record.name)
                    .join(divider);
            }
        });
    }
    return $path;
};

const treeShared = (selected = [], treeArray = [], config = {}) => {
    const {
        parent = "parent",
        target = "key"
    } = config;
    const matrix = selected
        .map(key => treeParentAllIn([key], treeArray, parent))
        .map(keys => keys.map(each => __Zn.elementUnique(treeArray, "key", each))
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
}