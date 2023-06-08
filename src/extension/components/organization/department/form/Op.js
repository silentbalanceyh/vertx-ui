import Ex from 'ex';
import Ux from 'ux';

const $opAdd = (reference) =>
    params => Ex.form(reference).add(params, {
        uri: "/api/dept",
        dialog: "added",
    }).then(data => Ux.of(reference)._.ioIn(Ex.K.DEPT, data));
// .then(data => Ex.?x(reference).assistIn("resource.departments", data));
const $opSave = (reference) =>
    params => Ex.form(reference).save(params, {
        uri: "/api/dept/:key",
        dialog: "saved"
    }).then(data => Ux.of(reference)._.ioIn(Ex.K.DEPT, data));
// .then(data => Ex.?x(reference).assistIn("resource.departments", data));
const $opDelete = (reference) =>
    params => Ex.form(reference).remove(params, {
        uri: "/api/dept/:key",
        dialog: "removed"
    }).then(data => Ux.of(reference)._.ioOut(Ex.K.DEPT, data));
// .then(() => Ex.?x(reference).assistOut("resource.departments", params));
const $opFilter = (reference) =>
    params => Ex.form(reference).filter(params);
const rxPostDelete = (reference) => (data) =>
    Ex.rxAssist(reference)(Ex.K.DEPT, data, true);
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