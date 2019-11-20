import Ux from 'ux';

export default (reference, $query = {}) => (event) => {
    Ux.prevent(event);
    const state = {};
    state.$clean = undefined;
    state.$query = $query;
    reference.setState(state);
}