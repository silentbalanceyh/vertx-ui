import Ex from 'ex';
import Ux from "ux";

const $opAdd = (reference) =>
    params => Ex.form(reference).add(params, {
        uri: "/api/team",
        dialog: "added",
    }).then(data => Ux.of(reference)._.ioIn(Ex.K.TEAM, data));
// then(data => Ex.?x(reference).assistIn("resource.teams", data));
const $opSave = (reference) =>
    params => Ex.form(reference).save(params, {
        uri: "/api/team/:key",
        dialog: "saved"
    }).then(data => Ux.of(reference)._.ioIn(Ex.K.TEAM, data));
// then(data => Ex.?x(reference).assistIn("resource.teams", data));

const $opDelete = (reference) =>
    params => Ex.form(reference).remove(params, {
        uri: "/api/team/:key",
        dialog: "removed"
    }).then(data => Ux.of(reference)._.ioOut(Ex.K.TEAM, data))
// then(data => Ex.?x(reference).assistOut("resource.teams", data));

const $opFilter = (reference) =>
    params => Ex.form(reference).filter(params);
const rxPostDelete = (reference) => (data) =>
    Ex.rxAssist(reference)(Ex.K.TEAM, data, true);
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