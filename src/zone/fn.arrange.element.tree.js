import __QR from './fn.assemble.element.qr';
import __A from './fn.atomic.foundation';
import __Is from './fn.under.is.decision';

import __SORT_FN from './fn.unity.sorter.fn';

const elementBranch = (array = [], leafValue, parentField = "parent") => {
    // 查找的最终结果
    let branch = [];
    // 查找子节点
    const obj = __QR.elementUnique(array, "key", leafValue);
    if (obj) {
        const target = __A.clone(obj);//
        branch.push(target);
        // 查找父节点
        const pid = obj[parentField];
        branch = [].concat(elementBranch(array, pid, parentField)).concat(branch);
    }
    // console.info(found.map(item => elementUnique(array, "key", item)));
    return branch;
};
const elementParent = (array = [], leafValue, parentField = "parent") => {
    const normalized = elementBranch(array, leafValue, parentField);
    if (__Is.isArray(normalized)) {
        return normalized.filter(item => item.key !== leafValue);
    } else {
        return [];
    }
}
const elementChildTree = (array = [], current = {}, parentField = "parent") => {
    const parentKey = current.key;
    if (!current._level) {
        current._level = 1;
    }
    let children = array
        .filter(each => each[parentField] === parentKey)
        .sort(__SORT_FN.sorterAscTFn('sort'));
    if (0 < children.length) {
        children.forEach(child => {
            child._level = current._level + 1;
            child.children = elementChildTree(array, child, parentField)
        });
    }
    return children;
};

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
export default {
    elementBranch,
    elementParent,
    elementChildren,
    elementChildTree,
}