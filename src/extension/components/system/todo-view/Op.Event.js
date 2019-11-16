import Ex from 'ex';

const $opConfirm = (reference) => (params = {}) =>
    Ex.todo(reference).confirm(params, {
        dialog: "confirmed",
        redux: true,
    });
const $opReject = (reference) => (params = {}) => {
    Ex.todo(reference).reject(params, {
        dialog: "rejected",
        redux: true,
    });
};
export default {
    $opConfirm,
    $opReject
}