import Ex from "ex";

const $opAdd = (reference) => params =>
    Ex.form(reference).add(params, {
        uri: "/api/entity",
        dialog: "added",
    });
const $opFilter = (reference) => params =>
    Ex.form(reference).filter(params);
const $opSave = (reference) => params =>{
    Ex.form(reference).save(params, {
        uri: "/api/entity/:key",
        dialog: "saved"
    });
};
const $opDelete = (reference) => params => Ex.form(reference).remove(params, {
    uri: "/api/entity/:key",
    dialog: "removed"
});
const $opSaveField = (reference) => params =>
    Ex.dialog(reference).saveRow(params);
const $opSaveKey = (reference) => params =>
    Ex.dialog(reference).saveRow(params);
export default {
    actions: {
        $opFilter,
        $opAdd,
        $opSave,
        $opDelete,
        $opSaveField,
        $opSaveKey,
    }
}