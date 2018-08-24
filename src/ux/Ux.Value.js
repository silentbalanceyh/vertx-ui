import Immutable from "immutable";
import Type from './Ux.Type';
import {DataArray, DataObject} from 'entity';
import Value from './value'

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
/**
 * mode = 0：调用原生的Object.assign：直接覆盖
 * mode = 1：将source中的属性追加到target中，深度追加
 * mode = 2：将source中的属性追加到target中，没有时追加
 * @param target
 * @param source
 * @param mode
 */
const assign = (target = {}, source = {}, mode = 0) => {
    let result = Immutable.fromJS(target).toJS();
    if (0 === mode) {
        result = Object.assign(target, source);
    } else {
        Type.itObject(source, (field, value) => {
            // 检查target中是否包含了field
            const targetValue = result[field];
            if ("object" === typeof targetValue
                && "object" === typeof value) {
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
/**
 * @class Value
 * @description 数值计算器
 */
export default {
    // 对象处理方法
    assign,
    clone,
    // 字符串链接
    stringConnect,

    ...Value,
}
