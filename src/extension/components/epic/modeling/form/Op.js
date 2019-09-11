import Ex from "ex";

const $opAdd = (reference) => params =>
    Ex.form(reference).add(params, {
        uri: "/api/entity",
        dialog: "added",
    });
const $opFilter = (reference) =>
    params => Ex.form(reference).filter(params);
const $opSave = (reference) => params => {
    console.info(params);
};
const $opSaveField = (reference) => params =>
    Ex.dialog(reference).saveRow(params);
const $opSaveKey = (reference) => params =>
    Ex.dialog(reference).saveRow(params);
export default {
    actions: {
        $opFilter,
        $opAdd,
        $opSave,
        $opSaveField,
        $opSaveKey,
    }
}