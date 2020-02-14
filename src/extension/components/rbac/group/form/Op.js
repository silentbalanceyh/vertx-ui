import Ex from 'ex';

const $opAdd = (reference) =>
    params => Ex.form(reference).add(params, {
        uri: "/api/group",
        dialog: "added",
    }).then(data => Ex.rx(reference).assistIn("ajax.groups", data));
const $opSave = (reference) =>
    params => Ex.form(reference).save(params, {
        uri: "/api/group/:key",
        dialog: "saved"
    }).then(data => Ex.rx(reference).assistIn("ajax.groups", data));
const $opDelete = (reference) =>
    params => Ex.form(reference).remove(params, {
        uri: "/api/group/:key",
        dialog: "removed"
    }).then(data => Ex.rx(reference).assistOut("ajax.groups", data));
const $opFilter = (reference) =>
    params => Ex.form(reference).filter(params);
const rxPostDelete = (reference) => (data) =>
    Ex.rxAssist(reference)("ajax.groups", data, true);
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