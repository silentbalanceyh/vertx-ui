import Ex from "ex";

const $opSave = (reference) => (params) =>
    Ex.form(reference).save(Ex.outJob(params), {
        uri: "/api/job/info/mission/:key",
        dialog: "saved"
    });
export default {
    actions: {
        $opSave,
    }
}