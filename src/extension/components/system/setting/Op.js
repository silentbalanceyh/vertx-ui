import Ex from "ex";
import Ux from 'ux';
import {Dsl} from "entity";

const $opSave = (reference) => (params) => Ex.form(reference).save(params, {
    uri: "/api/app",
    dialog: "saved"
}).then(updated => {
    Ux.storeApp(params, true);
    const {fnOut} = reference.props;
    if (Ux.isFunction(fnOut)) {
        fnOut(Dsl.createIn({app: params}));
    }
    return Ux.promise(updated);
});
const componentInit = (reference) => {
    const state = {};
    Ux.ajaxGet("/api/bag/extension").then(response => {
        state.$bag = response;
        Ux.of(reference).in(state).ready().done();
        // reference.?etState(state);
        // state.$ready = true;
    })
}
export default {
    actions: {
        $opSave
    },
    componentInit
}