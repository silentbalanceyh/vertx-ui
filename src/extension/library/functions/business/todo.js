import Ajax from '../../ajax';
import Fn from "../generator";
import Ux from 'ux';

const confirm = (reference) => (params = {}, config = {}) => {
    return Ajax.todo(params, true)
        .then(Ux.ajax2Dialog(reference, config.dialog, config.redux))
        .then(response => Fn.rx(reference).close(response));
};
const reject = (reference) => (params = {}, config = {}) => {
    return Ajax.todo(params, false)
        .then(Ux.ajax2Dialog(reference, config.dialog, config.redux))
        .then(response => Fn.rx(reference).close(response));
};
export default (reference) => ({
    confirm: confirm(reference),
    reject: reject(reference)
})