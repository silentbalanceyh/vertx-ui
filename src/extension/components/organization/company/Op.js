import Ex from 'ex';

const $opSaveMy = (reference) =>
    (params) => Ex.form(reference).save(params, {
        uri: '/api/company/:key',
        dialog: "savedMy",
        off: true,
    });
export default {
    actions: {
        $opSaveMy,
    }
}