import U from 'underscore';
import Immutable from "immutable";
import Type from "../Ux.Type";
import Util from '../util';
import moment from "moment";
import {DataArray, DataObject} from "entity";

const isEmpty = (input) => {
    if (input) {
        if (U.isArray(input)) {
            return 0 === input.length;
        } else {
            return 0 === Object.keys(input).length;
        }
    } else return false;
};
const toJson = (input) => {
    if ("string" === typeof input) {
        try {
            return JSON.parse(input);
        } catch (e) {
            return null;
        }
    } else return input;
};
const clone = (input) => {
    if (input instanceof DataObject || input instanceof DataArray) {
        if (input.is()) {
            return Immutable.fromJS(input.to()).toJS();
        } else {
            return input;
        }
    } else {
        return input ? Immutable.fromJS(input).toJS() : input;
    }
};
/**
 * mode = 0：调用原生的Object.assign：直接覆盖
 * mode = 1：将source中的属性追加到target中，深度追加
 * mode = 2：将source中的属性追加到target中，没有时追加
 * @param target
 * @param source
 * @param mode
 */
const assign = (target = {}, source = {}, mode = 0) => {
    if (!target) target = {};
    let result = clone(target);
    if (0 === mode) {
        result = Object.assign(target, source);
    } else {
        Type.itObject(source, (field, value) => {
            // 检查target中是否包含了field
            const targetValue = result[field];
            if (U.isObject(targetValue) && !moment.isMoment(targetValue) &&
                U.isObject(value) && !moment.isMoment(value)) {
                // 当前节点为两个对象，统一方式合并，且mode也相同
                result[field] = assign(targetValue, value, mode);
            } else {
                if (1 === mode) {
                    // 直接覆盖
                    result[field] = value;
                } else if (2 === mode) {
                    // 没有属性才追加
                    if (!target.hasOwnProperty(field)) {
                        result[field] = value;
                    }
                }
            }
        });
    }
    return result;
};
const vector = (item = {}, config = {}) => {
    const target = clone(item);
    Type.itObject(config, (from, to) => {
        if (item.hasOwnProperty(from)) {
            target[to] = item[from];
            delete target[from];
        }
    });
    return target;
};
const expand = (item = {}, mapping = {}) => {
    const object = {};
    Type.itObject(mapping, (from, to) => {
        if (item.hasOwnProperty(to)) {
            object[from] = item[to];
        } else if (item.hasOwnProperty(from)) {
            object[to] = item[from];
        }
    });
    return Object.assign(object, item);
};
const slice = (input, ...keys) => {
    if (0 < keys.length) {
        const fnClone = (item) => {
            const newItem = {};
            keys.filter(each => item.hasOwnProperty(each))
                .forEach(key => newItem[key] = item[key]);
            return newItem;
        };
        if (U.isArray(input)) {
            return input.map(each => fnClone.apply(this, [each].concat(keys)));
        } else if (U.isObject(input)) {
            return fnClone.apply(this, [input].concat(keys));
        } else return {};
    } else return {};
};
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
const matrix = (array = [], object = {}, fnExecute, fnPredicate) => {
    if (!isEmpty(object)) {
        // 是否检查
        const predicate = U.isFunction(fnPredicate) ? fnPredicate : () => true;
        Type.itFull(array, object, (item = {}, key, value) => {
            if (predicate(value)) {
                fnExecute(item, key, value);
            }
        });
    }
};
const cut = (array, ...attr) => {
    const target = clone(array);
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
// --- 子节点处理
const _childrenByField = (array = [], config = {}) => {
    const {key, item, field, zero = true, sorter} = config;
    if (!key) return [];
    const pValue = item[key];
    let childrenArray = array.filter(each => each[field] === pValue);
    childrenArray = clone(childrenArray);
    if (0 < childrenArray.length) {
        childrenArray.forEach(each => {
            each.children = _childrenByField(array, {
                key, item: each, field, zero, sorter
            });
            if (!zero && 0 === each.children.length) {
                delete each.children;
            } else {
                if (sorter) {
                    each.children = each.children.sort(Util.sorterAscFn(sorter));
                }
            }
        });
    }
    return childrenArray;
};
const Child = {
    byField: _childrenByField
};
export default {
    // 判断是否为空
    isEmpty,
    // 安全转换
    toJson,
    // 三种模式的合并
    assign,
    // 拷贝
    clone,
    // 直接转换
    vector,
    // 设置合并方法
    expand,
    // 子对象
    slice,
    // 遍历
    element,
    // 全遍历
    matrix,
    // 双遍历
    each,
    // field双意函数
    field,
    // 移除
    cut,
    // 二义性函数
    to,
    // 不可变处理
    immutable: Immutable.fromJS,
    // 子节点检索
    Child,
};