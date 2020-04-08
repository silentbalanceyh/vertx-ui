import G from '../global';
import Ux from 'ux';

/**
 * ## 扩展函数
 *
 * 批量删除函数
 *
 * @memberOf module:_rx
 * @param {ReactComponent} reference React对应组件引用
 * @returns {Function} 生成函数
 */
const rxBatchDelete = (reference) => (event) => {
    Ux.prevent(event);
    return Ux.sexBatch(reference, ($selected = []) => {
        const {options = {}} = reference.state;
        const uri = options[G.Opt.AJAX_BATCH_DELETE_URI];
        return Ux.ajaxDelete(uri, $selected);
    }, {name: "rxBatchDelete", message: G.Opt.MESSAGE_BATCH_DELETE});
};
/**
 * ## 扩展函数
 *
 * 批量更新函数
 *
 * @memberOf module:_rx
 * @param {ReactComponent} reference React对应组件引用
 * @returns {Function} 生成函数
 */
const rxBatchEdit = (reference) => (params = []) => Ux.sexBatch(reference, ($selected = []) => {
    const {options = {}} = reference.state;
    const uri = options[G.Opt.AJAX_BATCH_UPDATE_URI];
    return Ux.ajaxPut(uri, params);
}, {name: "rxBatchEdit", reset: true, message: G.Opt.MESSAGE_BATCH_UPDATE});
export default {
    rxBatchDelete,
    rxBatchEdit,
}