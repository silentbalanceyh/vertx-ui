import Ux from 'ux';

const yiPage = (reference) => {
    //const state = {};
    //state.$ready = true;
    Ux.of(reference).ready().done();
    // reference.?etState(state);
};
export default {
    yiPage,
}