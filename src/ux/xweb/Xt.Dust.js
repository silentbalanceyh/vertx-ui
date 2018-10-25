import U from 'underscore';
import Value from '../Ux.Value';
import Event from './Xt.Event';
import Ux from "ux";
import Prop from "../prop/Ux.Prop";

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
/**
 * 将props中的Ant Design对应的Form引用挂载到父引用中的$_pointer中
 * @param ref
 * @param key
 */
const xtPointer = (ref, key) => {
    if (key) {
        // 当前组件属性props中的Ant Design的Form引用挂载到父状态的$_pointer中
        const {reference} = ref.props;
        const {$_pointer = {}} = reference.state;
        $_pointer[key] = ref.props.form;
        reference.setState({$_pointer});
    } else {
        // 中间节点继续挂载
        const {$_pointer} = ref.state;
        if ($_pointer) {
            const parent = Prop.onReference(ref, 1);
            parent.setState({
                $_pointer, $_child: ref,
            });
        }
    }
};

const xtUpdateForm = (reference, prevProps, ...fields) => {
    const {form} = reference.props;
    if (form) {
        // 之前的值
        const $previous = prevProps.$inited ? prevProps.$inited : {};
        const {$inited = {}} = reference.props;
        // 初始值的变化
        const previous = Value.slice.apply(this, [$previous].concat(fields));
        const inited = Value.slice.apply(this, [$inited].concat(fields));
        if (Value.isDiff(previous, inited)) {
            const values = Value.clone(inited);
            form.setFieldsValue(values);
        }
    }
};

export default {
    xtPointer,
    xtUnsafe,
    xtGet,
    xtReset,
    xtResetData,
    xtPrevious,
    xtUpdateForm,
};