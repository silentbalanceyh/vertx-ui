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
const xtInit = (props = {}) => props.value || {};
const xtInitArray = (props = {}, empty = false) => ({
    source: empty ? (props.value || []) : (props.value || [{key: Util.randomUUID()}])
});

const xtGet = (reference, field, supplier) => {
    let state = reference.state ? reference.state : {};
    if (U.isFunction(supplier)) {
        state[field] = supplier();
    } else {
        if (supplier) state[field] = supplier;
    }
    return Value.clone(state);
};

const xtReset = (reference, defaultValue = {}) => {
    const value = reference.props.value;
    if (!value) {
        reference.setState(defaultValue);
    }
};
export default {
    xtUnsafe,
    xtInit,
    xtInitArray,
    xtGet,
    xtReset,
}