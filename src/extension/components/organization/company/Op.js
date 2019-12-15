import Ex from 'ex';

const $opSaveMy = (reference) =>
    (params) => Ex.form(reference).save(params, {
        uri: '/api/company/:key',
        dialog: "savedMy"
    });
export default {
    actions: {
        $opSaveMy,
    }
}