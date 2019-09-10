import Ex from 'ex';

const $opAdd = (reference) =>
    params => Ex.form(reference).add(params, {
        uri: "/api/role",
        dialog: "added",
    });
const $opSave = (reference) =>
    params => Ex.form(reference).save(params, {
        uri: "/api/role/:key",
        dialog: "saved"
    });
const $opDelete = (reference) =>
    params => Ex.form(reference).remove(params, {
        uri: "/api/role/:key",
        dialog: "removed"
    });
const $opFilter = (reference) =>
    params => Ex.form(reference).filter(params);

export default {
    actions: {
        $opAdd,
        $opSave,
        $opDelete,
        $opFilter
    }
}