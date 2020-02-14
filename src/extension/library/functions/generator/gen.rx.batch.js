import G from '../global';
import Ux from 'ux';
/*
 * 这里的 reference 是当前 ExComplexList
 */
const rxBatchDelete = (reference) => (event) => {
    Ux.prevent(event);
    return Ux.sexBatch(reference, ($selected = []) => {
        const {options = {}} = reference.state;
        const uri = options[G.Opt.AJAX_BATCH_DELETE_URI];
        return Ux.ajaxDelete(uri, $selected);
    }, {name: "rxBatchDelete", message: G.Opt.MESSAGE_BATCH_DELETE});
};
const rxBatchEdit = (reference) => (params = []) => Ux.sexBatch(reference, ($selected = []) => {
    const {options = {}} = reference.state;
    const uri = options[G.Opt.AJAX_BATCH_UPDATE_URI];
    return Ux.ajaxPut(uri, params);
}, {name: "rxBatchEdit", reset: true, message: G.Opt.MESSAGE_BATCH_UPDATE});
export default {
    rxBatchDelete,
    rxBatchEdit,
}