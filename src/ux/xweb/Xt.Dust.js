import U from 'underscore';
import Value from '../Ux.Value';
import Event from './Xt.Event';
import Ux from "ux";

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
        Event.xtChange(reference, defaultValue, true);
    }
};
const xtResetData = (reference, data = {}) => {
    const value = reference.props.value;
    if (!value) {
        reference.setState({data});
        Ux.xtChange(reference, {}, true);
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
    xtGet,
    xtReset,
    xtResetData,
    xtPrevious,
};