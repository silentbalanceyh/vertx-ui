import jQuery from 'jquery';
import __Zn from './zero.module.dependency';

const v4Icon = (type, rest = {}) =>
    __Zn.v4Icon(type, rest);

const v4FormFailure = (target, id, show) => {
    if (id) {
        const id_help = `#${id}_help`;
        const ele = jQuery(id_help);
        if (ele) {
            const children = ele.children("div");
            if (children) children.css("display", show ? "inline-block" : "none");
        }
    }
}
const v4FormRef = (reference) => {
    const {formRef = {}} = reference;
    if (formRef) {
        if (formRef.current) {
            // 注意这行代码在 componentDidMount 中无法提取到
            return formRef.current;
        } else {
            const {form} = reference.props;
            if (form) {
                return form;
            }
        }
    }
    /*
     * 旧版：const { form } = reference.props
     * 新版：const { formRef } = reference
     *      formRef.current ( V4 以上 )
     */
}
const v4FormHidden = (reference, field, values = {}) => {
    const attrs = {};
    attrs.hidden = true;
    attrs.name = field;
    attrs.key = field;
    const value = values[field];
    if (value) {
        attrs.initialValue = value;
    }
    return attrs;
}
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    // Icon connected to ant-design V3
    v4Icon,
    // Form Error connected to ant-design V4
    v4FormRef,
    v4FormFailure,
    v4FormHidden,
}