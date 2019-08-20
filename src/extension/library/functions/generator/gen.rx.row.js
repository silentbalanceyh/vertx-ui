import G from "../global";
import Ux from "ux";

const rxDelete = (reference) => (key) => {
    if (key) {
        const {options = {}} = G.state(reference);
        const uri = options[G.Opt.AJAX_DELETE_URI];
        return Ux.ajaxDelete(uri, {key});
    }
};
const rxView = (reference) => (key) => {
    if (key) {
        const {options = {}} = G.state(reference);
        const uri = options[G.Opt.AJAX_GET_URI];
        return Ux.ajaxGet(uri, {key});
    }
};
const rxSelected = (reference) => ($selected = []) =>
    reference.setState({$selected});
export default {
    rxDelete,
    rxSelected,
    rxView,
}