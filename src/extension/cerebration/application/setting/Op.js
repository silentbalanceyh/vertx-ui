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
export default {
    actions: {
        $opSave
    }
}