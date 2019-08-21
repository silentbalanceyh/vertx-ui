import Ex from 'ex';

const $opAdd = (reference) => Ex.xtOp(reference, {
    success: params => Ex.form(reference).add(params, {
        uri: "/api/customer",
        dialog: "added",
    })
});
const $opSave = (reference) => Ex.xtOp(reference, {
    success: params => Ex.form(reference).save(params, {
        uri: "/api/customer/:key",
        dialog: "saved"
    })
});
const $opDelete = (reference) => Ex.xtOp(reference, {
    success: params => Ex.form(reference).remove(params, {
        uri: "/api/customer/:key",
        dialog: "removed"
    })
});
const $opFilter = (reference) => Ex.xtOp(reference, {
    success: params => Ex.form(reference).filter(params)
}, true);

export default {
    actions: {
        $opAdd,
        $opSave,
        $opDelete,
        $opFilter
    }
}