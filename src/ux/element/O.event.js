import U from "underscore";
import Immutable from "immutable";

/**
 * ## 标准喊
 *
 * 自定义组件专用触发函数，onChange专用处理，当前组件用于处理表格编辑器中的行编辑功能
 *
 * @memberOf module:_value
 * @deprecated
 * @param {React.Component} reference React组件引用。
 * @param {any} value 当前自定义组件的值。
 * @param {String} key 状态中的数据来源。
 * @param {String} field 当前字段名。
 * @param {Number} index 当前记录所在的索引行。
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
/**
 * 自定义组件专用函数，动态组件专用函数
 *
 * @memberOf module:_value
 * @deprecated
 * @param {React.Component} reference React组件引用。
 * @param {any} value 当前自定义组件的值。
 * @param {String} key 状态中的数据来源。
 * @param {String} field 当前字段名。
 * @param {Number} index 当前记录所在的索引行。
 * @param {Number} sequence 当前记录所在行的序号信息。
 */
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
/**
 * ## 标准函数
 *
 * 行编辑器专用函数，用于编辑表格行相关信息
 *
 * @memberOf module:_value
 * @param {React.Component} reference React组件引用。
 * @param {Object} state 组件引用本身状态信息。
 * @param {String} key 状态中需要处理的字段信息`key`。
 */
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