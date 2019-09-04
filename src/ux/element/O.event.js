import U from "underscore";
import Immutable from "immutable";

/**
 * 变更专用处理
 * @method valueTriggerChange
 * @param reference
 * @param value
 * @param key
 * @param field
 * @param index
 */
const valueTriggerChange = (reference = {}, {
    index, field, key = "source", value
}) => {
    let source = reference.state ? reference.state[key] : [];
    if (U.isArray(source)) {
        if (!source[index]) {
            source[index] = {};
        }
        source[index][field] = value;
    }
    source = Immutable.fromJS(source).toJS();
    const state = {};
    state[key] = source;
    reference.setState(state);
    // 变更
    valueOnChange(reference, state, key);
};

const valueDynamicChange = (reference = {}, {
    index, field, key = "dataSource", value, sequence
}) => {
    let dataSource = reference.state ? reference.state[key] : {};
    if (sequence) {
        const current = dataSource[sequence];
        if (U.isArray(current)) {
            if (!current[index]) {
                current[index] = [];
            }
            current[index][field] = value;
        }
        dataSource[sequence] = current;
        dataSource = Immutable.fromJS(dataSource).toJS();
        const state = {};
        state[key] = dataSource;
        reference.setState(state);
        // 变更
        valueOnChange(reference, state, key);
    }
};

const valueOnChange = (reference = {}, state, key = "source") => {
    const onChange = reference.props.onChange;
    if (onChange) {
        const newValue = Object.assign({}, reference.state, state);
        onChange(newValue[key]);
    } else {
        console.error("valueOnChange丢失了onChange方法");
    }
};

export default {
    // 处理变化
    valueTriggerChange,
    valueOnChange,
    valueDynamicChange,
};