import Ux from 'ux';
import G from '../global';

/**
 * ## 扩展函数
 *
 * 导出专用函数
 *
 * @memberOf module:_rx
 * @param {ReactComponent} reference React对应组件引用
 * @returns {Function} 生成函数
 */
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
/**
 * ## 扩展函数
 *
 * 导入专用函数
 *
 * @memberOf module:_rx
 * @param {ReactComponent} reference React对应组件引用
 * @returns {Function} 生成函数
 */
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