import Ex from "ex";

const $opAdd = (reference) => params =>
    Ex.form(reference).add(params, {
        uri: "/api/model",
        dialog: "added",
    });
const $opFilter = (reference) => params =>
    Ex.form(reference).filter(params);
const $opSave = (reference) => params =>{
    Ex.form(reference).save(params, {
        uri: "/api/model/:key",
        dialog: "saved"
    });
};
const $opSaveRelation = (reference) => params =>
    Ex.dialog(reference).saveRow(params);
const $opSaveAttribute = (reference) => params =>
    Ex.dialog(reference).saveRow(params);
export default {
    actions: {
        $opFilter,
        $opAdd,
        $opSave,
        $opSaveRelation,
        $opSaveAttribute,
    }
}