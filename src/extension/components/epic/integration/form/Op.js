import Ex from "ex";

const $opSave = (reference) => (params) => {
    console.info(params);
    return Ex.form(reference).save(Ex.outApi(params), {
        uri: "/api/x-api/:key",
        dialog: "saved"
    })
};
export default {
    actions: {
        $opSave,
    }
}