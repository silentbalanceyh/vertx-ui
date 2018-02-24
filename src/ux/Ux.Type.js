import U from "underscore";
import Immutable from "immutable";
import Dg from "./Ux.Debug";
import Prop from "./Ux.Prop";

const elementUnique = (data = [], field = "", value) => {
    Dg.ensureType(data, U.isArray, "Array");
    let reference = data.filter(item => value === item[field]);
    Dg.ensureLength(reference, 1);
    return 0 === reference.length ? undefined : reference[0];
};
const elementFirst = (data = [], field = "") => {
    Dg.ensureType(data, U.isArray, "Array");
    return 0 < data.length ? data[0][field] : undefined;
};
const elementFind = (data = [], filters) => {
    Dg.ensureType(data, U.isArray, "Array");
    let reference = data;
    if (filters) {
        for (const field in filters) {
            if (filters.hasOwnProperty(field)) {
                reference = reference.filter(
                    item => item[field] === filters[field]
                );
            }
        }
    }
    return reference;
};
const itElement = (data = [], field = "", itemFun = () => {}) => {
    Dg.ensureType(data, U.isArray, "Array");
    Dg.ensureType(itemFun, U.isFunction, "Function");
    data.forEach(item => {
        if (item && item[field]) {
            item[field] = itemFun(item[field], item);
        }
    });
};
const itObject = (data = {}, executor = () => {}) => {
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            const value = data[key];
            if (value) {
                executor(key, value);
            }
        }
    }
};
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
const itFull = (data = [], items = {}, fieldFun = () => {}) => {
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
const elementAdd = (array = [], element = {}) => {
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
};
const elementSwitch = (array = [], element = "") => {
    let $elements = Immutable.fromJS(array);
    if ($elements.contains(element)) {
        $elements = $elements.remove(element);
    } else {
        $elements = $elements.push(element);
    }
    return $elements.toJS();
};
export default {
    // 数组中查找唯一元素
    elementUnique,
    elementUniqueDatum: (reference, key, field, value) =>
        elementUnique(Prop.onDatum(reference, key), field, value),
    // 查找数据中第一个元素
    elementFirst,
    elementFind,
    elementFindDatum: (reference, key, filters) =>
        elementFind(Prop.onDatum(reference, key), filters),
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
