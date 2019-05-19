import Ux from 'ux';

const write = (ref, react = {}, redux = {}) => {
    if (redux) {
        Ux.writeTree(ref, redux);
    }
    if (react) {
        ref.setState(react);
    }
};
export default {
    write
}