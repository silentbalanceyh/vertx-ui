import Immutable from 'immutable'
import Prop from '../Ux.Prop';
import Table from './Jt.Table';
import Matrix from './Jt.Matrix';
import Selector from './Jt.Selector';

const jctChange = (reference, changedValue) => {
    const onChange = reference.props.onChange;
    if (onChange) {
        const newValue = Object.assign({}, reference.state, changedValue);
        const newState = Immutable.fromJS(newValue).toJS();
        onChange(newState);
    }
};
const jctUnsafe = (reference, nextProps) => {
    if ('value' in nextProps) {
        const value = nextProps.value;
        reference.setState(value);
    }
};

const jctPointer = (ref, key) => {
    if (key) {
        // 当前组件属性props中的Ant Design的Form引用挂载到父状态的$_pointer中
        const {reference} = ref.props;
        const {$_pointer = {}} = reference.state;
        $_pointer[key] = ref.props.form;
    } else {
        // 中间节点继续挂载
        const {$_pointer} = ref.state;
        if ($_pointer) {
            const parent = Prop.onReference(ref, 1);
            parent.setState({
                $_pointer, $_child: ref,
            })
        }
    }
};
// jct -- Js Control Tool
export default {
    // 自定义组件专用改变值的方法
    jctChange,
    // 自定义组件的Unsafe修改属性方法
    jctUnsafe,
    // 自定义组件的Pointer引用交换
    jctPointer,
    // Table Editor批量方法
    ...Table,
    // Matrix Editor
    ...Matrix,
    // List Selector
    ...Selector,
}