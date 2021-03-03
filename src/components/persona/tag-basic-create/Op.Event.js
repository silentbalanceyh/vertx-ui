import Ux from "ux";
import {Dsl} from 'entity';
import {Of} from 'app';

export default {
    rxSubmit: (reference) => (event) => {
        Ux.prevent(event);
        const action = Ux.toQuery("action");
        const api = "EDIT" === action ? Of.apiTagUpdate : Of.apiTagCreate;
        reference.setState({$submitting: true})
        return Ux.formSubmit(reference).then(params => {
            // 对接
            return Dsl.of(reference).bind(api).ok((values) => {
                Ux.sexDialog(reference, "EDIT" === action ? "updated" : "created",
                    () => Ux.toRoute(reference, "/persona/tag-basic", {key: null}))
            }).ko(() => reference.setState({$submitting: false})).async(params);
        }).catch(error => {
            console.error(error);
            reference.setState({$submitting: false})
        })
    },
    rxCancel: (reference) => (event) => {
        Ux.prevent(event);
        // 进入页面 tag-basic-create
        Ux.toRoute(reference, "/persona/tag-basic", {key: null})
    }
}