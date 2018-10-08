import U from 'underscore';
import Value from '../Ux.Value';
import Util from '../util';

/**
 * UNSAFE_componentWillReceiveProps(nextProps,context)
 * @param reference
 * @param nextProps
 */
const xtUnsafe = (reference, nextProps = {}) => {
    if ('value' in nextProps) {
        const value = nextProps.value;
        reference.setState(value);
    }
};
/**
 * 初始化专用方法
 * @param props
 */
const xtInit = (props = {}) => (props.value || {});
const xtInitArray = (props = {}, empty = false) => {
    const values = {};
    // 初始化处理
    const value = props.value;
    if (value) {
        values.data = U.isArray(value) ? value : (U.isArray(value.data) ? value.data :
            ((empty) ? [] : [{key: Util.randomUUID()}]));
    } else {
        values.data = ((empty) ? [] : [{key: Util.randomUUID()}]);
    }
    return values;
};

const xtGet = (reference, field, supplier) => {
    let state = (reference.state ? reference.state : {});
    if (U.isFunction(supplier)) {
        state[field] = supplier();
    } else {
        if (supplier) {
            state[field] = supplier;
        }
    }
    return Value.clone(state);
};

const xtReset = (reference, defaultValue = {}) => {
    const value = reference.props.value;
    if (!value) {
        reference.setState(defaultValue);
    }
};
const xtPrevious = (reference) => {
    const {value} = reference.props;
    if (value) {
        // $开头的变量会被过滤掉
        reference.setState({$value: value});
    }
};
export default {
    xtUnsafe,
    xtInit,
    xtInitArray,
    xtGet,
    xtReset,
    xtPrevious,
};