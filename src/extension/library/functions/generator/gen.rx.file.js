import Ux from 'ux';
import G from '../global';

const rxExport = (reference) => (params = {}) => {
    if (!Ux.isEmpty(params)) {
        const {options = {}} = reference.state;
        const uri = options[G.Opt.AJAX_EXPORT_URI];
        const query = Ux.qrInherit(reference);
        /*
         * 带搜索条件导出
         */
        if (query.criteria) {
            params.criteria = Ux.clone(query.criteria);
        }
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