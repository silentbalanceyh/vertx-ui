import Ux from 'ux';
import Callback from './Op.Callback';
import {message} from 'antd';
import Verify from './Op.Verify';

const on2CustomRequest = (reference) => (details = {}) => {
    const {ajax = {}} = reference.props;
    if (!Ux.isEmpty(ajax)) {
        // 读取配置信息
        let api = ajax.uri;
        let params = Ux.clone(ajax.params);
        // 读取Form引用
        const ref = Ux.onReference(reference, 1);
        // 构造最终的下载Action
        params = Ux.valueSearch(params, ref.props);
        api = Ux.formatExpr(api, params);
        return Ux.ajaxUpload(api, details.file)
            .then(data => details.onSuccess(data));
    } else {
        const error = Ux.fromHoc(reference, "error");
        message.error(error.ajax);
        return Promise.reject({error: error.ajax});
    }
};

const getHandler = (reference) => {
    const handler = {};
    // 前置验证处理
    handler.beforeUpload = Verify.on2Before(reference);
    // 上传改变处理
    handler.onChange = Callback.on2Change(reference);    // 变更专用方法
    handler.onPreview = Callback.on2Preview(reference);
    handler.customRequest = on2CustomRequest(reference);
    return handler;
};
export default {
    getHandler
}