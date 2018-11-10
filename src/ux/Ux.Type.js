import U from "underscore";
import Prop from "./prop/Ux.Prop";
import {DataLabor} from "entity";
import E from './Ux.Error';
import Value from './Ux.Value';

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

/**
 * 数组拉平专用算法，以子节点field中的key为主
 * @method elementFlat
 * @param {Array} array 被追加的数组
 * @param field 需要拉平的字段值
 */
const elementFlat = (array = [], field = "", parent = false) => {
    const result = parent ? Value.clone(array) : [];
    array.forEach(item => {
        const fnChildren = (children = []) => U.isArray(children) ?
            children.forEach(child => {
                let target = Value.immutable(item);
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

const elementZip = (left = [], right = [], from = "key", to = "key") => {
    const result = [];
    left.forEach(item => {
        // 左元素
        const source = Value.clone(item);
        const value = source[from];
        if (value) {
            const target = right.filter(each => value === each[to]);
            if (1 === target.length && target[0]) {
                Object.assign(source, target[0]);
            }
        }
        result.push(source);
    });
    return result;
};

/**
 * 数组连接Tabular/Assist专用算法
 * @param array 原始数组信息
 * @param target 被连接的数组信息
 * @param field 需要执行的key = element[field]的条件查找唯一元素
 * @param mapping 执行最终的mapping动作：from -> to
 */
const elementConnect = (array = [], target = [], field, mapping = {}) => {
    if (mapping && 0 < Object.keys(mapping).length
        && field && 0 < target.length) {
        let $array = [];
        array.forEach((item = {}) => {
            const entity = elementUnique(target, "key", item[field]);
            if (entity) {
                let $item = Value.immutable(item);
                for (const fromKey in mapping) {
                    if (mapping.hasOwnProperty(fromKey)) {
                        const toKey = mapping[fromKey];
                        $item = $item.set(toKey, entity[fromKey]);
                    }
                }
                $array.push($item.toJS());
            }
        });
        return $array;
    } else {
        return array;
    }
};
/**
 * 返回数组的第一个元素中的field字段值
 * * field有值则返回对应的Object的字段值
 * * field没有值则直接返回该元素
 * @method elementFirst
 * @param {Array} data 查找的数组
 * @param {String} field
 */
const elementFirst = (data = [], field = "") => {
    E.fxTerminal(!U.isArray(data), 10071, data, "Array");
    if (0 < data.length) {
        if (field) {
            // 如果有field则返回对应字段的值
            return data[0] ? data[0][field] : undefined;
        } else {
            // 否则返回第一个Array中的元素
            return data[0];
        }
    } else {
        return undefined;
    }
};
/**
 * 按`filters`过滤查询Array对应的值
 * @method elementFind
 * @param {Array} data 查找的数组
 * @param filters 查找条件
 * @return {Array}
 */
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
                        const $value = Value.immutable(value);
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
 * 按`filters`中的条件模糊匹配Array对应的值
 * @method elementMatch
 * @param {Array} data 查找的数组
 * @param filters 查找条件
 * @return {Array}
 */
const elementMatch = (data = [], filters = {}) => {
    E.fxTerminal(!U.isArray(data), 10071, data, "Array");
    const itemMatch = (data = [], key, value) => data.filter(item => {

        return (value && item[key] && 0 <= item[key].indexOf(value));
    });
    for (const key in filters) {
        if (filters.hasOwnProperty(key) && filters[key]) {
            data = itemMatch(data, key, filters[key]);
        }
    }
    return data;
};
/**
 * 遍历数组中的某个字段，并处理该字段对应的`field`的值
 * @method itElement
 * @param {Array} data 被遍历的数组
 * @param {String} field 需要替换的字段
 * @param {Function} itemFun 替换函数
 */
const itElement = (data = [], field = "", itemFun = () => {
}) => {
    E.fxTerminal(!U.isArray(data), 10071, data, "Array");
    E.fxTerminal(!U.isFunction(itemFun), 10071, itemFun, "Function");
    data.forEach(item => {
        if (item && item[field]) {
            item[field] = itemFun(item[field], item);
        }
    });
};
/**
 * 遍历对象直接处理key = value
 * @method itObject
 * @param data 被遍历的对象
 * @param {Function} executor 处理函数
 */
const itObject = (data = {}, executor = () => {
}, invalid = false) => {
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            const value = data[key];
            if (invalid) {
                executor(key, value);
            } else {
                if (value) {
                    executor(key, value);
                }
            }
        }
    }
};

const itData = (config = {}, consumer = () => {
}) => {
    for (const key in config) {
        if (config.hasOwnProperty(key)) {
            const expr = config[key];
            E.fxTerminal("string" !== typeof expr, 10008, key, expr);
            E.fxTerminal(0 > expr.indexOf(':'), 10008, key, expr);
            const kv = expr.split(':');
            let value;
            // 特殊的包含.操作符合法
            if ("DATUM" === kv[0] || "PROP" === kv[0]) {
                // 映射到path[0]
                value = [kv[1].split(',')];
            } else if ("ENUM" === kv[0] || "FIX" === kv[0]) {
                value = [kv[1]];
            } else {
                value = kv[1].split('.');
            }
            if (U.isFunction(consumer)) {
                consumer(key, kv[0], value);
            }
        }
    }
};
/**
 * 二维数组遍历专用
 * @method itMatrix
 * @param matrix 被遍历的二维数组（矩阵）
 * @param {Function} eachFun
 * @return {Matrix} 返回原始的Matrix
 */
const itMatrix = (matrix = [], eachFun) => {
    matrix.forEach(row => {
        if (U.isArray(row)) {
            row.forEach(item => eachFun(item));
        } else {
            eachFun(row);
        }
    });
    return matrix;
};

const itRepeat = (number, eachFun) => {
    const limit = Value.valueInt(number);
    for (let idx = 0; idx < limit; idx++) {
        eachFun(idx);
    }
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
            const $result = Value.immutable(result);
            if (!$result.contains(item[field])) {
                result.push(item[field]);
            }
        }
    });
    return result;
};
const elementApeak = (data = {}, field = "") => {
    E.fxTerminal(!U.isObject(data), 10071, data, "Object");
    let result = [];
    itObject(data, (key, value) => {
        if (U.isArray(value)) {
            result = result.concat(value);
        }
    });
    return elementVertical(result, field);
};
/**
 * 遍历专用函数，二维遍历
 * @method itFull
 * @param {Array} data 被遍历的数组
 * @param {Object} items 被遍历的对象
 * @param {Function} fieldFun 操作函数
 */
const itFull = (data = [], items = {}, fieldFun = () => {
}) => {
    E.fxTerminal(!U.isArray(data), 10071, data, "Array");
    E.fxTerminal(!U.isFunction(fieldFun), 10071, fieldFun, "Function");
    data.forEach(item => {
        // 遍历数组中的每个元素
        if (item) {
            for (const key in items) {
                // item中的值处理
                const value = items[key];
                if (key && value) {
                    // Object -> item
                    // String -> key
                    // Unknown -> value
                    fieldFun(item, key, value);
                }
            }
        }
    });
};
/**
 * 不重复元素追加
 * * 如果是对象则检查key属性是否重复
 * * 如果不是对象则直接追加
 * @method elementAdd
 * @param {Array} array 被追加的数组
 * @param element 元素信息
 */
const elementAdd = (array = [], element) => {
    if (element) {
        if (U.isObject(element)) {
            const filter = array.filter(item => element.key === item.key);
            if (0 === filter.length) {
                array.push(element);
            }
        } else if ("string" === typeof element || "number" === typeof element) {
            const $elements = Value.immutable(array);
            if (!$elements.contains(element)) {
                array.push(element);
            }
        }
    }
};
/**
 * 左右值处理，如果存在则移除，如果不存在直接添加
 * @method elementSwitch
 * @param {Array} array 传入的数组
 * @param element 处理的元素信息
 * @return {*}
 */
const elementSwitch = (array = [], element = "") => {
    let $elements = Value.immutable(array);
    if ($elements.contains(element)) {
        $elements = $elements.remove(element);
    } else {
        $elements = $elements.push(element);
    }
    return $elements.toJS();
};
/**
 * 查找一个颗树的某个分支构成一个新的数组
 * @method elementBranch
 * @param {Array} array 被查找的数
 * @param leafKey 过滤条件
 * @param parentField 父节点字段
 * @param field 主键字段
 */
const elementBranch = (array = [], leafKey, parentField, field = "key") => {
    // 查找的最终结果
    let branch = [];
    // 查找子节点
    const obj = elementUnique(array, field, leafKey);
    if (obj) {
        const target = Value.clone(obj);//
        branch.push(target);
        // 查找父节点
        const pid = obj[parentField];
        branch = branch.concat(elementBranch(array, pid, parentField, field));
    }
    return branch.reverse();
};
/**
 * 查找一颗树以及它下边的所有新数组
 * @method elementChildren
 * @param {Array} array 被查找的数
 * @param parentKey 过滤条件
 * @param parentField
 */
const elementChildren = (array = [], parentKey, parentField, field = "key") => {
    let children = [];
    const obj = elementUnique(array, field, parentKey);
    if (obj) {
        const target = Value.clone(obj);
        children.push(target);
        // 查找子节点
        const childrenArr = array.filter(item => parentKey === item[parentField]);
        childrenArr.forEach(child => children = children.concat(elementChildren(array, child[field], parentField, field)));
    }
    return children;
};
/**
 * 针对数组中的某个字段求和
 * @method elementSum
 * @param {Array} data
 * @param field 需要映射的字段名
 * @return {Number}
 */
const elementSum = (data = [], field = "") => {
    const result = data
        .map(item => item[field])
        .filter(item => !!item);
    return (0 < result.length) ? result.reduce((left, right) => left + right) : 0;
};
/**
 * 构造一颗专用的树桩结构，用于表格的处理，config的配置项如下
 *
 *      ...
 *      {
 *          "id":"用于构造树的记录主键，默认值为id",
 *          "pid":"用于构造树的父节点字段，默认值为pid",
 *          "value":"用于构造树的记录值，默认值为value",
 *          "label":"默认用于构造树的呈现字段，默认值为label",
 *          "expr":"如果该值支持表达式结构，则使用exprLabel代替label",
 *          "sort":"当前Tree中节点的排序字段，没有默认值"
 *      }
 * 数组中必须包含`level`字段：树的深度字段，必须包含该值，使用该值进行树的运算。
 * @method tree
 * @param {Array} array 原始数组
 * @param {Object} config 构造时的树的配置信息
 * @return {DataTree | *}
 */
const tree = (array = [], config = {}) => DataLabor.getTree(array, config).to();
/**
 * 带过滤条件的Tree专用，内置调用tree方法
 * @method treeWithFilters
 * @param {Array} array 原始数组
 * @param filters 过滤条件
 * @param {Object} config 构造时的树的配置信息
 * @return {DataTree|*}
 */
const treeWithFilters = (array = [], filters = {}, config = {}) =>
    tree(elementMatch(array, filters), config);
/**
 * @class Type
 * @description 复杂数据结构计算
 */
export default {
    // 查找树中相关元素
    elementBranch,
    elementChildren,
    // 数组中查找唯一元素
    elementUnique,
    /**
     * 增强Unique，查找Tabuler/Assist专用
     * @method elementUniqueDatum
     * @param {React.PureComponent} reference React对应组件引用
     * @param key 被命中的key
     * @param field
     * @param value
     */
    elementUniqueDatum: (reference, key, field, value) =>
        elementUnique(Prop.onDatum(reference, key), field, value),
    // 查找数据中第一个元素
    elementFirst,
    elementFind,
    elementMatch,
    /**
     * 增强Find，查找Tabular/Assist专用
     * @method elementFindDatum
     * @param {React.PureComponent} reference React对应组件引用
     * @param key 被命中的key
     * @param filters 查询条件
     * @return {Array}
     */
    elementFindDatum: (reference, key, filters) =>
        elementFind(Prop.onDatum(reference, key), filters),
    /**
     * 增强First，查找Tabular/Assist专用
     * @method elementFirstDatum
     * @param {React.PureComponent} reference React对应组件引用
     * @param key 被命中的key
     * @param field
     * @return {*}
     */
    elementFirstDatum: (reference, key, field) =>
        elementFirst(Prop.onDatum(reference, key), field),
    elementAdd,     // 不重复添加元素到数组
    elementVertical,    // 查找垂直元素：Array中直接查找
    elementApeak,   // 查找垂直元素：Object中每一个key对应的都是一个数组
    // 添加和删除重合
    elementSwitch,
    // 拉平专用，支持单数组拉平和双数组拉平
    elementFlat,
    elementZip,
    // 连接Tabular/Assist
    elementConnect,
    // 求和计算
    elementSum,
    // 遍历数组并抽取对象数组中的field字段执行处理
    itElement,
    // 遍历数组以及对应对象信息
    itFull,
    // 遍历对象
    itObject,
    itMatrix,
    itData,
    itRepeat,
    // 树的构造方法
    tree,
    treeWithFilters
};
