import Ex from 'ex';

const $opAdd = (reference) =>
    params => Ex.form(reference).add(params, {
        uri: "/api/team",
        dialog: "added",
    }).then(data => Ex.rx(reference).assistIn("resource.teams", data));
const $opSave = (reference) =>
    params => Ex.form(reference).save(params, {
        uri: "/api/team/:key",
        dialog: "saved"
    }).then(data => Ex.rx(reference).assistIn("resource.teams", data));
;
const $opDelete = (reference) =>
    params => Ex.form(reference).remove(params, {
        uri: "/api/team/:key",
        dialog: "removed"
    }).then(data => Ex.rx(reference).assistOut("resource.teams", data));
;
const $opFilter = (reference) =>
    params => Ex.form(reference).filter(params);
const rxPostDelete = (reference) => (data) =>
    Ex.rxAssist(reference)("resource.teams", data, true);
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