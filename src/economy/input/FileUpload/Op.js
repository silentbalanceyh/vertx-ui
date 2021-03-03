import Ux from 'ux';
import {saveAs} from "file-saver";
import {message} from 'antd';

const _setImage = (reference, file) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => reference.setState({
        $loading: false,    // 加载完成
        $imageUrl: reader.result,   // 图片URL地址
    }));
    if (file) reader.readAsDataURL(file);
};
const _doDone = (reference, info = {}) => {
    // 上传完成
    if ("done" === info.file.status) {
        // 如果listType为picture-card
        const {listType} = reference.props;
        if ("picture-card" === listType) {
            // 图片模式
            _setImage(reference, info.file.originFileObj);
        } else {
            // 其他格式
            reference.setState({$loading: false});
        }
    }
};
const _doLoading = (reference, info = {}) => {
    if ("uploading" === info.file.status) {
        reference.setState({
            $loading: true,
        });
    }
};
const _onChange = (reference, fileList = []) => {
    const {config = {}} = reference.props;
    const field = config['filekey'] ? config['filekey'] : "key";
    // eslint-disable-next-line no-unused-vars
    const files = fileList.filter(file => file.hasOwnProperty('response'))
        .map(item => {
            const each = {};
            each.uid = item.uid;
            each.name = item.name;
            each.key = item.response[field];
            each.type = item.type;  // 数据类型
            return each;
        });
};
const on2Change = (reference) => (info = {}) => {
    // 正在上传
    _doLoading(reference, info);
    // 上传完成
    _doDone(reference, info);
    // 始终更新fileList（onChange触发两次，防止beforeUpload问题）
    reference.setState({
        fileList: info.fileList,    // 已上传文件列表
        $counter: info.fileList.length // 已上传文件数量
    });
    // 设置更新过后的基础数据
    _onChange(reference, info.fileList);
};

const on2Preview = (reference) => (file) => {
    const {listType} = reference.props;
    if ("picture-card" === listType) {
        // 1.picture-card / picture才会直接preview
        reference.setState({
            $current_url: file.thumbUrl,
            $current_name: file.name,
            $visible: true
        });
    } else {
        // 2.其他模式直接下载该文件
        // 刚刚上传过的处理
        if (file.hasOwnProperty('originFileObj')) {
            saveAs(file.originFileObj, file.name);
        } else {
            const {ajax = {}} = reference.props;
            Ux.ajaxDownload(ajax.download, Ux.clone(file))
                .then(data => saveAs(data, file.name));
        }
    }
};
const on2Before = (reference) => (file) => {
    // 如果通过的情况
    const {config = {}} = reference.props;
    const error = Ux.fromHoc(reference, "error");
    // 1.单文件限制上传
    let verified = true;
    if (config.single) {
        const {$counter = 0} = reference.state;
        if (0 < $counter) {
            message.destroy();
            message.error(error.single);
            verified = false;
        }
    }
    // 2.文件大小限制
    if (verified && config.limit) {
        const current = file.size / 1024;
        if (current > config.limit) {
            message.destroy();
            message.error(Ux.formatExpr(error.limit, {
                size: config.limit,
                current: current.toFixed(2)
            }));
            verified = false;
        }
    }
    return verified ? Promise.resolve(file) : Promise.reject();
};
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

const onHandler = (reference) => {
    const handler = {};
    // 前置验证处理
    handler.beforeUpload = on2Before(reference);
    // 上传改变处理
    handler.onChange = on2Change(reference);    // 变更专用方法
    handler.onPreview = on2Preview(reference);
    handler.customRequest = on2CustomRequest(reference);
    return handler;
};
export default {
    onHandler
};