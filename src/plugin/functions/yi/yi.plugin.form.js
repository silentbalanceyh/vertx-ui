import Ux from "ux";
import isLifeCycle from "../isLifeCycle";

export default (reference) => {
    const state = {};
    /*
     * tree array
     */
    const identifier = Ux.sexIdentifier(reference);
    if (identifier) {
        const code = Ux.formatExpr("form.:identifier.batch", {identifier});
        return Ux.ajaxGet('/api/ui/form/:code', {code}).then(response => {
            const staticForm = Ux.fromHoc(reference, "form");
            const form = Ux.toForm(staticForm, response);
            state.raft = Ux.configForm(form, {reference});
            state.$ready = true;
            /*
             * $edition
             */
            const $edition = {};
            $edition.lifecycle = isLifeCycle(reference);
            state.$edition = $edition;
            reference.setState(state);
        })
    } else {
        state.$ready = true;
        reference.setState(state);
    }
}