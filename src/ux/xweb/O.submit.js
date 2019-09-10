import U from 'underscore';
import Ele from '../element';
import Dev from '../develop';
import Abs from '../abyss';

const xtContent = (reference, additional = {}) => {
    const {$_pointer = {}} = reference.state;
    // 开启Form本身的验证功能，使用验证生成Promise
    const valueArray = Object.keys($_pointer).map(key => $_pointer[key])
        .filter(form => !!form && U.isFunction(form.getFieldsValue))
        .map(form => form.getFieldsValue());
    // 设置Form中的数据
    const content = {};
    valueArray.filter(item => !!item).forEach(item => Object.assign(content, item));
    // 去掉其他项
    Object.assign(content, additional);
    Ele.valueValid(content);
    Dev.dgDebug(content, "所有子Form数据");
    return content;
};

const xtMounter = (ref, key) => {
    if (key) {
        const {reference} = ref.props;
        const {$_pointer = {}} = reference.state;
        if (!$_pointer.hasOwnProperty(key)) {
            const form = ref.props.form;
            if (form) {
                $_pointer[key] = form;
                reference.setState({$_pointer: Abs.clone($_pointer)});
            }
        }
    }
};
export default {
    xtContent,
    xtMounter
};