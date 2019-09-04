import U from 'underscore';
import Abs from '../abyss';
import Immutable from 'immutable';

const element = (input, fnExecute) => {
    if (U.isFunction(fnExecute)) {
        if (U.isArray(input)) {
            // 数组执行每一个元素
            input.forEach((item, index) => {
                if (U.isObject(item)) {
                    fnExecute(item, index);
                }
            });
        } else {
            if (U.isObject(input)) {
                // 非数组执行当前对象
                fnExecute(input);
            }
        }
    }
};

const cut = (array, ...attr) => {
    const target = Abs.clone(array);
    const fnCut = (item = {}) => attr.filter(field => item.hasOwnProperty(field))
        .forEach(field => delete item[field]);
    element(target, fnCut);
};
/**
 * 双遍历
 * @param input
 * @param fnExecute
 */
const each = (input, fnExecute) => {
    if (input) {
        if (U.isArray(input)) {
            input.forEach((item, index) => fnExecute(item, index, input));
        } else if (U.isObject(input)) {
            for (const key in input) {
                if (input.hasOwnProperty(key)) {
                    fnExecute(key, input[key], input);
                }
            }
        }
    }
};
const matrix = (array = [], object = {}, fnExecute, fnPredicate) => {
    if (!Abs.isEmpty(object)) {
        // 是否检查
        const predicate = U.isFunction(fnPredicate) ? fnPredicate : () => true;
        Abs.itFull(array, object, (item = {}, key, value) => {
            if (predicate(value)) {
                fnExecute(item, key, value);
            }
        });
    }
};
const expand = (item = {}, mapping = {}, overwrite = false) => {
    const object = {};
    Abs.itObject(mapping, (from, to) => {
        // 如果item包含了右边，则直接左边的值的等于右边
        if (item.hasOwnProperty(to)) {
            object[from] = item[to];
        } else if (item.hasOwnProperty(from)) {
            object[to] = item[from];
        }
    });
    return overwrite ? Object.assign(item, object) :
        Object.assign(object, item);
};
const to = (value) => {
    if (value) {
        if (U.isFunction(value)) {
            const result = value();
            return result ? result : {};
        } else {
            return value;
        }
    } else return {};
};
const field = (instance, name, value) => {
    if (instance && "string" === typeof name) {
        let $instance = Immutable.fromJS(instance);
        // 如果value为undefined（2参数，读取）
        if (value) {
            // 【二义性处理】Function和值
            value = to(value);
            if (0 <= name.indexOf('.')) {
                const path = name.split('.');
                $instance = $instance.setIn(path, value);
            } else {
                $instance = $instance.set(name, value);
            }
        } else {
            if (0 <= name.indexOf('.')) {
                const path = name.split('.');
                $instance = $instance.getIn(path);
            } else {
                $instance = $instance.get(name);
            }
        }
        // 返回读取的最终结果
        return U.isFunction($instance.toJS) ? $instance.toJS() : $instance;
    }
};
export default {
    each,
    cut,
    matrix,
    expand,
    field,
}