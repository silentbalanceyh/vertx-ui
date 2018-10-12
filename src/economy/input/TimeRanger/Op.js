import Ux from 'ux';

const on2Change = (reference, field = "") => (event) => {
    let state = Ux.clone(reference.state);
    if (!state) state = {};
    state[field] = event;
    reference.setState(state);
    Ux.xtChange(reference, state, true);
};
const getDefault = () => ({
    from: null,
    to: null,
});
export default {
    on2Change,
    getDefault
};