import Ux from 'ux';
import G from '../global';

const rxExport = (reference) => (params = {}) => {
    if (!Ux.isEmpty(params)) {
        const {options = {}} = reference.state;
        const uri = options[G.Opt.AJAX_EXPORT_URI];
        return Ux.ajaxPull(uri, params);
    }
};
const rxImport = (reference) => (file) => {
    if (file) {
        const {options = {}} = reference.state;
        const uri = options[G.Opt.AJAX_IMPORT_URI];
        return Ux.ajaxUpload(uri, file);
    }
};
export default {
    rxExport,
    rxImport
}