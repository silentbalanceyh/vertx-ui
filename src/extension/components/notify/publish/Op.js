import Ex from 'ex';
import Ux from "ux";

const $opSave = (reference) =>
    (params) => {
        return Ex.form(reference).add(params, {
            uri: '/api/x-notice',
            dialog: 'added'
        }).then(() => {
            Ux.formReset(reference);
        });
    };

export default {
    actions: {
        $opSave,
    }
}