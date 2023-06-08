import __Is from './fn.under.is.decision';
import __E from './fn.debug.fx.error';
import __A from './fn.atomic.foundation';

const elementGroup = (array = [], field) => {
    let result = {};
    if (0 < array.length) {
        let $result = __A.immutable(array).groupBy(item => item.get(field));
        if ($result) {
            result = $result.toJS();
        }
    }
    return result;
};

const elementGet = (data = {}, path) => {
    if ("string" === typeof path) {
        if (0 <= path.indexOf('.')) {
            return elementGet(data, path.split('.'));
        } else {
            return data[path];
        }
    } else {
        const item = __A.immutable(data);
        return item.getIn(path);
    }
}
const elementFind = (array = [], filters, fuzzy = false) => {
    __E.fxTerminal(!__Is.isArray(array), 10071, array, "Array");
    let reference = array;
    if (filters) {
        // eslint-disable-next-line
        for (const field in filters) {
            if (filters.hasOwnProperty(field)) {
                // 这里用双等号匹配，用于检查字符串和数值的比较
                reference = reference.filter(item => {
                    const value = filters[field];
                    if (__Is.isArray(value)) {
                        return value.includes(item[field]);
                    } else {
                        if (fuzzy) {
                            if (item.hasOwnProperty(field)) {
                                return item[field] === value;
                            } else {
                                // 直接过滤掉
                                return true;
                            }
                        } else {
                            return item[field] === value;
                        }
                    }
                });
            }
        }
    }
    return reference;
};
const elementUnique = (array = [], field = "", value, targetField) => {
    __E.fxTerminal(!__Is.isArray(array), 10071, array, "Array");
    let reference = [];
    if (__Is.isObject(field)) {
        // Filter模式
        reference = elementFind(array, field);
    } else {
        reference = array.filter(item => value === item[field]);
    }
    __E.fxTerminal(1 < reference.length, 10069, reference, 1);
    const found = 0 === reference.length ? undefined : reference[0];
    if (found) {
        if (targetField) {
            return found[targetField] ? found[targetField] : null;
        } else {
            return found;
        }
    }
};
const elementMap = (array = [], field = "", fieldTo) => {
    __E.fxTerminal(!__Is.isArray(array), 10071, array, "Array");
    let resultMap = {};
    array.forEach(item => {
        if (item[field]) {
            const record = __A.clone(item);
            if (fieldTo) {
                resultMap[item[field]] = record[fieldTo];
            } else {
                resultMap[item[field]] = record;
            }

        }
    });
    return resultMap;
}
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
const elementFirst = (array = [], field) => {
    const target = array[0];
    if (target) {
        if (__Is.isObject(target)) {
            /*
             *
             */
            return field ? target[field] : target;
        } else {
            return target;
        }
    }
}
const elementVertical = (array = [], field = "") => {
    __E.fxTerminal(!__Is.isArray(array), 10071, array, "Array");
    let result = [];
    array.forEach(item => {
        if (item[field]) {
            if (!result.includes(item[field])) {
                result.push(item[field]);
            }
        }
    });
    return result;
};
const elementIn = (ele = [], source = [], isAnd = true) => {
    // 拆元素
    const checked = ele.filter(ele => source.includes(ele));
    if (isAnd) {
        // 所有的元素都必须包含
        return ele.length === checked.length;
    } else {
        // 包含一个即可
        return 0 < checked.length;
    }
}
export default {
    elementFind,
    elementUnique,
    elementGroup,
    elementGet,
    elementMap,
    elementIndex,
    elementFirst,
    elementVertical,

    elementInAll: (ele = [], source = []) => elementIn(ele, source, true),
    elementInAny: (ele = [], source = []) => elementIn(ele, source, false),
}