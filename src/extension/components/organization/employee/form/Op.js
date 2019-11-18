import Ex from 'ex';
import Ux from "ux";

const $opAdd = (reference) => (params) => Ex.form(reference).add(params, {
    uri: '/api/employee',
    dialog: 'added'
});
const $opSave = (reference) => params => Ex.form(reference).save(params, {
    uri: "/api/employee/:key",
    dialog: "saved"
});
const $opDelete = (reference) => params => Ex.form(reference).remove(params, {
    uri: "/api/employee/:key",
    dialog: "removed"
});
const $opFilter = (reference) => params => Ex.form(reference).filter(params);

const $opIdentity = (reference) => (params) => {
    if (Ux.isEmpty(params["key"])) {
        Ex.form(reference).add(params, {
            uri: '/api/identity',
            dialog: 'addedMy'
        });
    } else {
        Ex.form(reference).save(params, {
            uri: "/api/identity/:key",
            dialog: "savedMy"
        });
    }
};
export default {
    actions: {
        $opAdd,
        $opSave,
        $opDelete,
        $opFilter,
        $opIdentity,
    }
}