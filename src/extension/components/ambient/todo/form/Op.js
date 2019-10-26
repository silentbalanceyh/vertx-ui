import Ex from 'ex';
import Ux from 'ux';

const $opAdd = (reference) =>
    params => Ex.form(reference).add(params, {
        uri: "/api/group",
        dialog: "added",
    });
const $opSave = (reference) =>
    params => Ex.form(reference).save(params, {
        uri: "/api/group/:key",
        dialog: "saved"
    });
const $opDelete = (reference) =>
    params => Ex.form(reference).remove(params, {
        uri: "/api/group/:key",
        dialog: "removed"
    });
const $opFilter = (reference) =>
    params => Ex.form(reference).filter(params);

const yiForm = (reference) => {
    /*
     * 从 $options 中读取信息
     */
    const {$inited = {}, $options = {}} = reference.props;
    if (!$options.form) $options.form = {};
    const code = $options.form[$inited['modelId']];    // 从 XTodo 中提取 $identifier
    Ex.I.form({code}).then(config => {
        /*
         * XTODO record 规范化处理
         */
        const formConfig = Ux.fromHoc(reference, "form");
        console.info(config, formConfig);
    });
};
export default {
    yiForm,
    actions: {
        $opAdd,
        $opSave,
        $opDelete,
        $opFilter
    }
}