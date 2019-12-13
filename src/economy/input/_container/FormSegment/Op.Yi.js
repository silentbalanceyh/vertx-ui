import Ux from 'ux';

const asyncJson = (reference, state = {}) => {
    const {config: {form}} = reference.props;
    if (form) {
        state.$config = Ux.clone(form);
        return Ux.promise(state);
    } else {
        return Ux.promise({error: `source = JSON 配置解析出错, form = "${form}"`});
    }
};
const asyncForm = (reference, state = {}) => {
    const ref = Ux.onReference(reference, 1);
    if (ref) {
        const {$form = {}} = ref.props;
        const {config: {component}} = reference.props;
        const Component = $form[component];
        if (Component) {
            state.$component = Component;
            return Ux.promise(state);
        } else {
            return Ux.promise({error: `source = FORM 配置解析出错, form = "${component}"`});
        }
    } else {
        return Ux.promise({error: "source = FORM 配置解析出错"});
    }
};
const asyncAjax = (reference, state = {}) => {

};
export default {
    JSON: asyncJson,
    FORM: asyncForm,
    AJAX: asyncAjax,
}