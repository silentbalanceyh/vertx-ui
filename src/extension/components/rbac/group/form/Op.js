import Ex from 'ex';
import Ux from "ux";

const $opAdd = (reference) =>
    params => Ex.form(reference).add(params, {
        uri: "/api/group",
        dialog: "added",
    }).then(data => Ux.of(reference)._.ioIn(Ex.K.GROUP, data));
// .then(data => Ex.?x(reference).assistIn("ajax.groups", data));
const $opSave = (reference) =>
    params => Ex.form(reference).save(params, {
        uri: "/api/group/:key",
        dialog: "saved"
    }).then(data => Ux.of(reference)._.ioIn(Ex.K.GROUP, data));
// .then(data => Ex.?x(reference).assistIn("ajax.groups", data));
const $opDelete = (reference) =>
    params => Ex.form(reference).remove(params, {
        uri: "/api/group/:key",
        dialog: "removed"
    }).then(data => Ux.of(reference)._.ioOut(Ex.K.GROUP, data));
// .then(data => Ex.?x(reference).assistOut("ajax.groups", data));
const $opFilter = (reference) =>
    params => Ex.form(reference).filter(params);
const rxPostDelete = (reference) => (data) =>
    Ex.rxAssist(reference)(Ex.K.GROUP, data, true);
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