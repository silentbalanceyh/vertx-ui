import Value from '../Ux.Value';
import U from "underscore";

const annexState = (reference = {}, stateKey, dataKey, data) => {
    const state = reference.state ? reference.state : {};
    let original = state[stateKey];
    if (stateKey && dataKey && data) {
        original = Value.clone(original);
        original[dataKey] = data;
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

export default {
    // 带运算
    annexState,
    // 不带运算
    annexValue,
};