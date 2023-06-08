import __Zn from './zero.module.dependency';

const uExpand = (item = {}, mapping = {}, overwrite = false) => {
    const object = {};
    __Zn.itObject(mapping, (from, to) => {
        // 如果item包含了右边，则直接左边的值的等于右边
        if (item.hasOwnProperty(to)) {
            object[from] = item[to];
        } else if (item.hasOwnProperty(from)) {
            object[to] = item[from];
        }
    });
    return overwrite ? Object.assign(item, object) : Object.assign(object, item);
};

const __uElement = (input, fnExecute) => {
    if (__Zn.isFunction(fnExecute)) {
        if (__Zn.isArray(input)) {
            // 数组执行每一个元素
            input.forEach((item, index) => {
                if (__Zn.isObject(item)) {
                    fnExecute(item, index);
                }
            });
        } else {
            if (__Zn.isObject(input)) {
                // 非数组执行当前对象
                fnExecute(input);
            }
        }
    }
};
const uCut = (input, ...attr) => {
    const target = __Zn.clone(input);
    const fnCut = (item = {}) => attr.filter(field => item.hasOwnProperty(field))
        .forEach(field => delete item[field]);
    __uElement(target, fnCut);
};
const uEach = (input, fnExecute) => {
    if (input) {
        if (__Zn.isArray(input)) {
            input.forEach((item, index) => fnExecute(item, index, input));
        } else if (__Zn.isObject(input)) {
            // eslint-disable-next-line
            for (const key in input) {
                if (input.hasOwnProperty(key)) {
                    fnExecute(key, input[key], input);
                }
            }
        }
    }
};
export default {
    // Uson/Uarr
    uExpand,
    uEach,
    uCut,
}