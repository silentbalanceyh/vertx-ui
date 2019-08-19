import Ux from "ux";
import opLogin from './O.login';

const $opReset = (reference) => (event) => {
    event.preventDefault();
    Ux.formReset(reference);
};
export default {
    $opReset,
    ...opLogin,
}