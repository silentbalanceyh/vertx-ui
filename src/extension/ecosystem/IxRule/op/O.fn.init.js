import Ux from 'ux';
import {Dsl} from 'entity';
import Ex from "ex";
import renders from "../UI.RuleTerm";

export default (reference) => {
    const {$source} = reference.props;
    const state = {};
    if (Ux.isArray($source)) {
        state.$a_internal_models = Dsl.getArray($source);
        return Ex.yiPartForm(reference, {
            id: "formRule",
            renders,
            state,
        }, false).then(Ux.ready).then(Ux.pipe(reference));
    } else {
        return Ex.I.attributes($source).then((processed = []) => {
            state.$a_model_attributes = Dsl.getArray(processed);
            return Ex.yiPartForm(reference, {
                id: "formRule",
                renders,
                state,
            }, false).then(Ux.ready).then(Ux.pipe(reference));
        });
    }
}