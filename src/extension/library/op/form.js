import Ux from 'ux';

const $opReset = (reference) => (event) => {
    event.preventDefault();
    Ux.formReset(reference);
};
export default {
    DEFAULT_ACTION: {
        $opReset,
    },
}