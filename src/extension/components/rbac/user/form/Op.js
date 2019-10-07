import Ex from 'ex';
import Ux from "ux";

const $opAdd = (reference) =>
    params => Ex.form(reference).add(params, {
        uri: "/api/user",
        dialog: "added",
    });
const $opSave = (reference) =>
    params => Ex.form(reference).save(params, {
        uri: "/api/user/:key",
        dialog: "saved"
    });
const $opDelete = (reference) =>
    params => Ex.form(reference).remove(params, {
        uri: "/api/user/:key",
        dialog: "removed"
    });
const $opFilter = (reference) =>
    params => Ex.form(reference).filter(params);

const $opPassword = (reference) => params => {
    const request = Ux.valueRequest(params);
    request.password = Ux.encryptMD5(params['npassword']);
    Ex.form(reference).save(request, {
        uri: "/api/user/:key",
        dialog: "savedMy"
    });
};
export default {
    actions: {
        $opAdd,
        $opSave,
        $opDelete,
        $opFilter,
        $opPassword
    }
}