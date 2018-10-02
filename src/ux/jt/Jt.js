import Prop from '../prop/Ux.Prop';
import Table from './Jt.Table';
import Matrix from './Jt.Matrix';
import Selector from './Jt.Selector';
import Event from './Jt.Event';
import Dynamic from './Jt.Dynamic';
import E from "../Ux.Error";
import On from './Jt.On';

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
const jctForm = (forms = {}) => {
    const keys = [];
    const promises = [];
    for (const key in forms) {
        const form = forms[key];
        if (form) {
            form.validateFields((error, values) => {
                if (error) {
                    promises.push(Promise.reject({error}));
                } else {
                    promises.push(Promise.resolve(values));
                }
            });
            keys.push(key);
        }
    }
    return Promise.all(promises).then(data => {
        const result = {};
        keys.forEach((key, index) => result[key] = data[index]);
        return Promise.resolve(result);
    }).catch(error => Promise.reject(error))
};
const jctSubmit = (reference, key = "$_pointer") => {
    E.fxTerminal(!reference, 10049, reference);
    E.fxTerminal(!reference.state, 10084, reference.state);
    // 遍历读取所有Form引用
    const pointers = reference.state[key];
    if (pointers) {
        return jctForm(pointers);
    }
};
// jct -- Js Control Tool
export default {
    // Form专用取值
    jctForm,
    // 提交专用
    jctSubmit,
    // 自定义组件的Pointer引用交换
    jctPointer,
    // Table Editor批量方法
    ...Table,
    // Matrix Editor
    ...Matrix,
    // List Selector
    ...Selector,
    // 专用事件处理
    ...Event,
    // 动态处理
    ...Dynamic,
    // On事件处理
    ...On
}