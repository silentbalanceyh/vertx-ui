import Abs from '../abyss';
import E from '../error';
import U from 'underscore';

/**
 * 数组拉平专用算法，以子节点field中的key为主
 * @method elementFlat
 * @param {Array} array 被追加的数组
 * @param field 需要拉平的字段值
 * @param parent
 */
const elementFlat = (array = [], field = "", parent = false) => {
    const result = parent ? Abs.clone(array) : [];
    array.forEach(item => {
        const fnChildren = (children = []) => U.isArray(children) ?
            children.forEach(child => {
                let target = Abs.immutable(item);
                target = target.mergeDeep(child);
                target = target.remove(field);
                const $target = target.toJS();
                if (item.key) $target._parent = item.key;
                result.push($target);
            }) : {};
        // 读取字段中的值
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
 * 在数组中查找唯一元素
 * @method elementUnique
 * @param {Array} data 查找的数组
 * @param {String} field 字段
 * @param value
 */
const elementUnique = (data = [], field = "", value) => {
    E.fxTerminal(!U.isArray(data), 10071, data, "Array");
    let reference = [];
    if (U.isObject(field)) {
        // Filter模式
        reference = elementFind(data, field);
    } else {
        reference = data.filter(item => value === item[field]);
    }
    E.fxTerminal(1 < reference.length, 10069, reference, 1);
    return 0 === reference.length ? undefined : reference[0];
};

const elementFind = (data = [], filters) => {
    E.fxTerminal(!U.isArray(data), 10071, data, "Array");
    let reference = data;
    if (filters) {
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
 * Array数组中的属性映射处理
 * @method elementVertical
 * @param {Array} data
 * @param field 需要映射的字段名
 * @return {Array}
 */
const elementVertical = (data = [], field = "") => {
    E.fxTerminal(!U.isArray(data), 10071, data, "Array");
    let result = [];
    data.forEach(item => {
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
 * 查找一个颗树的某个分支构成一个新的数组
 * @method elementBranch
 * @param {Array} array 被查找的数
 * @param leafKey 过滤条件
 * @param parentField 父节点字段
 * @param field 主键字段
 */
const elementBranch = (array = [], leafKey) => {
    // 查找的最终结果
    let branch = [];
    // 查找子节点
    const obj = elementUnique(array, "key", leafKey);
    if (obj) {
        const target = Abs.clone(obj);//
        branch.push(target);
        // 查找父节点
        const pid = obj.parent;
        branch = branch.concat(elementBranch(array, pid));
    }
    return branch.reverse();
};
/*
 * 该方法只处理已经配置过的
 * {
 *     key: "key",
 *     parent: "parentId",
 *     value: "key",
 *     label: "label",
 *     sort: "order",
 *     level: "level"
 * }
 */
const elementChild = (array = [], current = {}) => {
    const parentKey = current.key;
    let children = array
        .filter(each => each.parent === parentKey)
        .sort((left, right) => left.sort - right.sort);
    if (0 < children.length) {
        children.forEach(child => child.children = elementChild(array, child));
    }
    return children;
};
export default {
    elementFlat,
    elementUnique,
    elementFind,
    elementVertical,
    // 树操作
    elementBranch,
    elementChild,
}