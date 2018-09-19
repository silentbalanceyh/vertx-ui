import Immutable from "immutable";
import U from "underscore";
import Type from './Ux.Type';
import {DataArray, DataObject} from 'entity';
import Value from './value'
import moment from 'moment'

/**
 * 两个字符串的专用连接方法，用于做不重复链接，
 * @method stringConnect
 * @private
 * @param left
 * @param right
 */
const stringConnect = (left, right) => {
    if (left && right && "string" === typeof left && "string" === typeof right) {
        if (right.startsWith(left)) {
            return right;
        } else {
            return left + right;
        }
    }
};
const arrayConnect = (item, fnEach, dividier = ',') => {
    if (!item) return [];
    if (U.isArray(item)) return item;
    if ("string" === typeof item) {
        const result = item.split(dividier);
        if (fnEach) {
            return result.map(fnEach);
        } else {
            return result;
        }
    } else {
        return [];
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
    let result = Immutable.fromJS(target).toJS();
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
        })
    }
    return result;
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
const fix = (cell, reference) => {
    // Fix：特殊Fix，兼容Raft模式和非Raft模式
    // Raft模式下应该是cell, reference
    // 非Raft模式下允许直接调用
    if (undefined === reference) {
        return cell;
    } else {
        return reference;
    }
};
const isEmpty = (object) => {
    if (object) {
        return !U.isArray(object) && 0 === Object.keys(object).length;
    } else {
        return true;
    }
};
/**
 * 二义性函数，传入的是string就执行parse处理
 * @param input
 * @returns {*}
 */
const toJson = (input) => {
    if ("string" === typeof input) {
        try {
            // 如果Parse过程出错
            return JSON.parse(input);
        } catch (e) {
            return null;
        }
    } else {
        return input;
    }
};
/**
 * @class Value
 * @description 数值计算器
 */
export default {
    // 严格判断
    isEmpty,
    toJson,
    // 对象处理方法
    assign,
    clone,
    vector,
    fix,
    // 字符串链接
    arrayConnect,
    stringConnect,

    ...Value,
}
