import Value from '../Ux.Value'
import Event from './Jt.Event'
import U from "underscore";
import E from "../Ux.Error";

const jonInput = (reference, field) => (event) => {
    let state = reference.state;
    state = state ? state : {};
    state[field] = event.target ? event.target.value : undefined;
    state = Value.clone(state);
    reference.setState(state);
    Event.jctChange(reference, state);
};

const jctFiltered = (newValue = {}) => {
    const filteredValue = {};
    Object.keys(newValue)
        .filter(key => !key.startsWith("$"))
        .forEach(key => filteredValue[key] = newValue[key]);
    return filteredValue;
};
// 变更专用方法
const jctChange = (reference, changedValue) => {
    const onChange = reference.props.onChange;
    if (U.isFunction(onChange)) {
        // 直接生成新数据
        let newValue = Object.assign({}, reference.state, changedValue);
        newValue = Value.clone(newValue);
        // 特殊处理，将$开头的全部过滤，防止被Hoc注入
        newValue = jctFiltered(newValue);
        // 变更数据处理
        onChange(newValue);
    } else {
        E.fxFatal(10095, onChange);
    }
};

const jctUnsafe = (reference, nextProps = {}) => {
    if ('value' in nextProps) {
        const value = nextProps.value;
        reference.setState(value);
    }
};
export default {
    // 输入框的改变
    jonInput,
    // 改变字段的统一调用方法
    jctChange,
    jctUnsafe,
}