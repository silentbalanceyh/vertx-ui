import Value from '../Ux.Value';
import U from "underscore";
import {DataObject} from 'entity';

const annexState = (state = {}, stateKey, dataKey, data) => {
    let original = state[stateKey];
    if (!original) original = {};
    if (stateKey && dataKey) {
        original = Value.clone(original);
        if (data) {
            // 添加新状态
            original[dataKey] = data;
        } else {
            // 删除原生状态
            if (original.hasOwnProperty(dataKey)) {
                delete original[dataKey];
            }
        }
        return original;
    } else {
        console.warn("[Ux] 未改变状态，", original);
        return original;
    }
};

const annexValue = (event, defaultValue) => {
    let value;
    if (event && U.isFunction(event.preventDefault)) {
        event.preventDefault();
        value = event.target.value;
    } else {
        value = event;
    }
    /** 默认值设置 **/
    if (!value && undefined !== defaultValue) {
        value = defaultValue;
    }
    return value;
};

const annexObject = (props = {}, key, name) => {
    const dataObj = props[key];
    let value;
    if (dataObj instanceof DataObject) {
        if (dataObj && dataObj.is()) {
            value = dataObj._(name);
        }
    } else if (U.isObject(dataObj)) {
        if (dataObj && !U.isArray(dataObj)) {
            value = dataObj[name];
        }
    }
    return value;
};
export default {
    // 带运算
    annexState,
    // 不带运算
    annexValue,
    // 带运算合并处理 props / state 中的值
    annexObject,
};