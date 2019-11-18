import Ex from 'ex';
import Ux from 'ux';

const $opFilter = (reference) =>
    params => Ex.form(reference).filter(params);

const yiForm = (reference) => {
    /*
     * 从 $options 中读取信息
     */
    const {$inited = {}, $options = {}} = reference.props;
    if (!$options.form) $options.form = {};
    const code = $options.form[$inited['modelId']];    // 从 XTodo 中提取 $identifier
    Ex.I.form({code}).then(dynamicForm => {
        /*
         * XTODO record 规范化处理
         */
        const staticForm = Ux.fromHoc(reference, "form");
        const $form = Ux.toForm(staticForm, dynamicForm);
        reference.setState({
            $form, $ready: true
        });
    });
};
const $opConfirm = (reference) => (params) => {
    console.info(params);
};
const $opReject = (reference) => (params) => {
    console.info(params);
};
export default {
    yiForm,
    actions: {
        $opConfirm,
        $opReject,
        $opFilter
    }
}