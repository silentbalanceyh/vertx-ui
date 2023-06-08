import Ux from 'ux';
import __V from './pedestal.v.constant.option';

const rxBatchDelete = (reference) => (event) => {
    Ux.prevent(event);
    const {options = {}} = reference.state;
    return Ux.sexBatch(reference, ($selected = []) => {
        const uri = options[__V.Opt.AJAX_BATCH_DELETE_URI];
        return Ux.ajaxDelete(uri, $selected);
    }, {name: "rxBatchDelete", message: options[__V.Opt.MESSAGE_BATCH_DELETE]});
};
const rxBatchEdit = (reference) => (params = [], config = {}) => {
    const {options = {}} = reference.state;
    /*
     * Fix #https://gitee.com/silentbalanceyh/vertx-zero-scaffold/issues/I6VQ3Y
     * 批量更新会出现两条显示问题
     */
    let message = config.message;
    if (!message) {
        message = __V.Opt.MESSAGE_BATCH_UPDATE;
    }
    return Ux.sexBatch(reference, ($selected = []) => {
        let uri = options[__V.Opt.AJAX_BATCH_UPDATE_URI];
        const module = options[__V.Opt.AJAX_MODULE];
        if (module) {
            uri = Ux.toUrl(uri, "module", options[__V.Opt.IDENTIFIER])
        }
        return Ux.ajaxPut(uri, params);
    }, {name: "rxBatchEdit", reset: true, message});
}
const rxExport = (reference) => (params = {}) => {
    if (!Ux.isEmpty(params)) {
        const {options = {}} = reference.state;
        let uri = options[__V.Opt.AJAX_EXPORT_URI];
        const query = Ux.qrInherit(reference);
        /*
         * 带搜索条件导出
         */
        if (query.criteria) {
            params.criteria = Ux.clone(query.criteria);
        }
        const module = options[__V.Opt.AJAX_MODULE];
        if (module) {
            uri = Ux.toUrl(uri, "module", options[__V.Opt.IDENTIFIER])
        }
        return Ux.ajaxPull(uri, params);
    }
};
const rxImport = (reference) => (file) => {
    if (file) {
        const {options = {}} = reference.state;
        let uri = options[__V.Opt.AJAX_IMPORT_URI];
        const module = options[__V.Opt.AJAX_MODULE];
        if (module) {
            uri = Ux.toUrl(uri, "module", options[__V.Opt.IDENTIFIER])
        }
        // type,status etc
        const {$router} = reference.props;
        if ($router) {
            const parameters = $router.params();
            Object.keys(parameters)
                .forEach(field => uri = Ux.toUrl(uri, field, parameters[field]))
        }
        return Ux.ajaxUpload(uri, file);
    } else {
        console.error("上传文件有问题，请检查！", file);
    }
};
export default {
    rxBatchEdit,        // Batch Edit
    rxBatchDelete,      // Batch Delete

    rxImport,           // Batch Add
    rxExport,           // Batch Get
}