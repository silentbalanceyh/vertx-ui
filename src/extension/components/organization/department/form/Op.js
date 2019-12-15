import Ex from 'ex';

const $opAdd = (reference) =>
    params => Ex.form(reference).add(params, {
        uri: "/api/dept",
        dialog: "added",
    }).then(data => Ex.rx(reference).assistIn("resource.departments", data));
const $opSave = (reference) =>
    params => Ex.form(reference).save(params, {
        uri: "/api/dept/:key",
        dialog: "saved"
    }).then(data => Ex.rx(reference).assistIn("resource.departments", data));
const $opDelete = (reference) =>
    params => Ex.form(reference).remove(params, {
        uri: "/api/dept/:key",
        dialog: "removed"
    }).then(() => Ex.rx(reference).assistOut("resource.departments", params));
const $opFilter = (reference) =>
    params => Ex.form(reference).filter(params);
const rxPostDelete = (reference) => (data) =>
    Ex.rxAssist(reference)("resource.departments", data, true);
const rxAssist = (reference) => Ex.rxAssist(reference);
export default {
    rxPostDelete,
    rxAssist,
    actions: {
        $opAdd,
        $opSave,
        $opDelete,
        $opFilter
    }
}