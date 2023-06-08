import Ex from 'ex';

const $opFilter = (reference) =>
    params => Ex.form(reference).filter(params);

export default {
    actions: {
        $opFilter
    }
}