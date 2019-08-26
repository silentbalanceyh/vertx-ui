import Ux from 'ux';
import Callback from './Op.Callback';
import {message} from 'antd';
import Verify from './Op.Verify';
import Q from 'q';
import U from 'underscore';

const on2CustomRequest = (reference) => (details = {}) => {
    const {ajax = {}} = reference.props;
    if (!Ux.isEmpty(ajax)) {
        // 读取配置信息
        let api = ajax.uri;
        let params = Ux.clone(ajax.params);
        // 读取Form引用
        const ref = Ux.onReference(reference, 1);
        // 构造最终的下载Action
        params = Ux.parseInput(params, ref);
        api = Ux.formatExpr(api, params);
        return Ux.ajaxUpload(api, details.file)
            .then(data => details.onSuccess(data));
    } else {
        const error = Ux.fromHoc(reference, "error");
        message.destroy();
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
const _asyncToUrl = (each = {}, blob) => new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(blob);
    reader.addEventListener("load", () => {
        const type = each.type ? each.type : "image/jpeg";
        const blob = new Blob([reader.result], {type});
        // Secondary
        const innerRder = new FileReader();
        innerRder.readAsDataURL(blob);
        innerRder.addEventListener("load", () => {
            each.thumbUrl = innerRder.result;
            resolve(each);
        });
    });
});
const _asyncDownload = (reference, value = []) =>
    Q.all(value.map(file => {
        const {ajax = {}} = reference.props;
        return Ux.ajaxDownload(ajax.download, Ux.clone(file));
    }));
const _asyncPreview = (reference, value = []) => (downloaded = []) => {
    // 遍历
    const promises = [];
    value.forEach((each, index) => {
        const promise = _asyncToUrl(each, downloaded[index]);
        promises.push(promise);
    });
    return Q.all(promises);
};
const initState = (reference) => {
    const handler = getHandler(reference);
    const callback = (fileList) =>
        reference.setState({
            handler, // 构造的Handler
            fileList, // 已上传文件内容
            $counter: fileList.length // 已上传文件数量
        });
    const {value = [], listType} = reference.props;
    if ("picture-card" === listType) {
        if (U.isArray(value)) {
            _asyncDownload(reference, value) // 并行下载
                .then(_asyncPreview(reference, value)) // 并行转换URL
                .then(item => callback(item)); // 设置FileList
        }
    } else {
        callback(value);
    }
};
export default {
    initState
};