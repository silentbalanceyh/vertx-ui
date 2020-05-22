import {saveAs} from "file-saver";
import Ux from 'ux';

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
    const files = fileList.filter(file => file.hasOwnProperty('response'))
        .map(item => {
            const each = {};
            each.uid = item.uid;
            each.name = item.name;
            each.key = item.response[field];
            each.type = item.type;  // 数据类型
            return each;
        });
    // Ux.xtChange(reference, files, true);
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
export default {
    on2Change,
    on2Preview
};