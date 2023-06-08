import __Zn from '../zero.uca.dependency';

const asyncJson = (reference, state = {}) => {
    const {config: {form}} = reference.props;
    if (form) {
        state.$config = __Zn.clone(form);
        return __Zn.promise(state);
    } else {
        return __Zn.promise({error: `source = JSON 配置解析出错, form = "${form}"`});
    }
};
const asyncForm = (reference, state = {}) => {
    const ref = __Zn.onReference(reference, 1);
    if (ref) {
        const {$form = {}} = ref.props;
        const {config: {component}} = reference.props;
        const Component = $form[component];
        if (Component) {
            state.$component = Component;
            return __Zn.promise(state);
        } else {
            return __Zn.promise({error: `source = FORM 配置解析出错, form = "${component}"`});
        }
    } else {
        return __Zn.promise({error: "source = FORM 配置解析出错"});
    }
};
const asyncAjax = (reference, state = {}) => {

};
export default {
    JSON: asyncJson,
    FORM: asyncForm,
    AJAX: asyncAjax,
}