import Ux from 'ux';

const write = (ref, react = {}, redux = {}) => {
    if (redux) {
        Ux.writeTree(ref, redux);
    }
    const reactState = {};
    reactState.ready = true;
    if (react) {
        Object.assign(reactState, react);
    }
    ref.setState(reactState);
};
export default {
    write
}