import Ux from 'ux';
import Ex from 'ex';
import UI from 'oi';

const yiModule = (reference) => {
    const {$form, $controls = {}} = reference.props;
    if ($form) {
        const {FormAdd, FormEdit, FormFilter} = $form;
        /*
         * 提取 三个核心的 control 数据
         */
        return Ux.promise({
            FormAdd: $controls[FormAdd],
            FormEdit: $controls[FormEdit],
            FormFilter: $controls[FormFilter]
        }).then(response => {
            const $form = {};
            Object.keys(response).forEach(field => $form[field] =
                (props) => Ex.xuiDecorator(response[field], UI, props));
            const state = {};
            state.$ready = true;
            state.$form = $form;
            reference.setState(state);
        });
    }
};
export default {
    yiModule
}