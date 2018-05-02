import U from "underscore";
import Immutable from "immutable";
import Dg from "./Ux.Debug";
import Prop from "./Ux.Prop";

/**
 * 在数组中查找唯一元素
 * @method elementUnique
 * @param {Array} data 查找的数组
 * @param {String} field 字段
 * @param value
 */
const elementUnique = (data = [], field = "", value) => {
    Dg.ensureType(data, U.isArray, "Array");
    let reference = data.filter(item => value === item[field]);
    Dg.ensureLength(reference, 1);
    return 0 === reference.length ? undefined : reference[0];
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
    Dg.ensureType(data, U.isArray, "Array");
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
    Dg.ensureType(data, U.isArray, "Array");
    let reference = data;
    if (filters) {
        for (const field in filters) {
            if (filters.hasOwnProperty(field)) {
                // 这里用双等号匹配，用于检查字符串和数值的比较
                reference = reference.filter(
                    item => item[field] === filters[field]
                );
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
    Dg.ensureType(data, U.isArray, "Array");
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
    Dg.ensureType(data, U.isArray, "Array");
    Dg.ensureType(itemFun, U.isFunction, "Function");
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
}) => {
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            const value = data[key];
            if (value) {
                executor(key, value);
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
        if (Array.prototype.isPrototypeOf(row)) {
            row.forEach(item => eachFun(item));
        } else {
            eachFun(row);
        }
    });
    return matrix;
};
/**
 * Array数组中的属性映射处理
 * @method elementVertical
 * @param {Array} data
 * @param field 需要映射的字段名
 * @return {Array}
 */
const elementVertical = (data = [], field = "") => {
    Dg.ensureType(data, U.isArray, "Array");
    let result = [];
    data.forEach(item => {
        if (item[field]) {
            const $result = Immutable.fromJS(result);
            if (!$result.contains(item[field])) {
                result.push(item[field]);
            }
        }
    });
    return result;
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
    Dg.ensureType(data, U.isArray, "Array");
    Dg.ensureType(fieldFun, U.isFunction, "Function");
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
        if ("object" === typeof element) {
            const filter = array.filter(item => element.key === item.key);
            if (0 === filter.length) {
                array.push(element);
            }
        } else if ("string" === typeof element || "number" === typeof element) {
            const $elements = Immutable.fromJS(array);
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
    let $elements = Immutable.fromJS(array);
    if ($elements.contains(element)) {
        $elements = $elements.remove(element);
    } else {
        $elements = $elements.push(element);
    }
    return $elements.toJS();
};
/**
 * @class Type
 * @description 复杂数据结构计算
 */
export default {
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
    // 不重复添加元素到数组
    elementAdd,
    // 查找某个垂直元素
    elementVertical,
    // 添加和删除重合
    elementSwitch,
    // 遍历数组并抽取对象数组中的field字段执行处理
    itElement,
    // 遍历数组以及对应对象信息
    itFull,
    // 遍历对象
    itObject,
    itMatrix
};
