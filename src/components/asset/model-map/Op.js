import {Of} from 'app';
import {Dsl} from 'entity';
import Ux from 'ux';

const yiPage = (reference) => {
    const state = {};
    Dsl.of(reference).bind(Of.apiModel).ok(response => {
        state.$inited = response;
        state.$ready = true;
        reference.setState(state);
    }).async()
}
const rxExtra = (reference) => () => ({
    lnkAdd: () => {
        const selected = Ux.toQuery("selected");
        Ux.toRoute(reference, `/asset/model-map-flow?selected=${selected}&target=/asset/model-map`)
    }
})
export default {
    yiPage,
    rxExtra
}