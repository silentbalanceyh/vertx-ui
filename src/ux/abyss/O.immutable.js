import {DataArray, DataObject} from "entity";
import Immutable from "immutable";
import It from "./O.it";
import Is from './O.is';
import U from "underscore";
import moment from "moment";

const clone = (input) => {
    if (input instanceof DataObject || input instanceof DataArray) {
        if (input.is()) {
            const object = input.to();
            // Object.freeze(object); freeze会变成只读对象
            return Immutable.fromJS(object).toJS();
        } else {
            if (input instanceof DataObject) {
                return Immutable.fromJS({}).toJS();
            } else {
                return Immutable.fromJS([]).toJS();
            }
        }
    } else {
        if (input) {
            // Object.freeze(input);
            return Immutable.fromJS(input).toJS();
        } else {
            return input;
        }
    }
};
/*
 * mode = 0 ：直接覆盖
 * mode = 1 ：深度覆盖
 * mode = 2 ：追加
 */
const assign = (target = {}, source = {}, mode = 0) => {
    if (!target) target = {};
    let result = clone(target);
    if (0 === mode) {
        result = Object.assign(target, source);
    } else {
        It.itObject(source, (field, value) => {
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
/*
 * 拦截专用函数
 */
const prevent = (event) => {
    /* 保证安全调用 */
    if (event && U.isFunction(event.preventDefault)) {
        event.preventDefault();
        return {};
    } else {
        /* 二义性，返回对应的Object值 */
        if (Is.isObject(event)) {
            return event;
        } else return {};
    }
};
export default {
    prevent,
    // 拷贝对象
    clone,
    // 不可变处理
    immutable: Immutable.fromJS,
    // 合并对象
    assign,
}