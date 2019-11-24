import Ex from 'ex';
import Ux from 'ux';
import actions from './Op.Event';
import Yo from './Op.Yo';

const yiPage = (reference) => {
    const key = Ux.toQuery("id");
    const state = {};
    return Ux.ajaxGet("/api/todo/:key", {key})
        .then(data => Ux.promise(state, "$inited", data))
        .then(() => Ex.yiStandard(reference, true))
        .then(response => Ux.promise(Object.assign(state, response)))
        .then(state => {
            state.$ready = true;
            reference.setState(state);
        })
};
const yiHistory = (reference) => {
    const $inited = Ux.ambiguityObject(reference, "$inited");
    const {activity = {}} = $inited;
    const module = activity['modelId'];
    const state = {};
    if (module) {
        Ux.ajaxGet("/api/ox/columns/:module/full", {module})
            .then(columns => Ex.mapAsyncDatum(columns, reference))
            .then(dict => {
                state.$dict = dict;
                state.$ready = true;
                reference.setState(state);
            })
    } else {
        state.$ready = true;
        reference.setState(state);
    }
};
export default {
    yiPage,
    yiHistory,
    ...Yo,
    actions,
}