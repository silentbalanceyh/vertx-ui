import React from 'react';
import './Cab.less';
import Op from './Op';
import {component} from "../../_internal";
import Rdr from './Web';
import {Input} from 'antd';
import Ux from "ux";

/**
 * ## 「组件」`FileUpload`
 *
 * 上传专用组件
 *
 * ```js
 * import { FileUpload } from 'web';
 * ```
 *
 * ### 0. 示例
 *
 * #### 0.1. Json配置
 *
 * ```json
 * {
 *      "metadata": "logo,应用Logo,18,,aiFileUpload,listType=picture-card,text=上传",
 *      "optionJsx.accept": "image/*",
 *      "optionJsx.config.filekey": "key",
 *      "optionJsx.config.limit": 10240,
 *      "optionJsx.config.single": true,
 *      "optionJsx.ajax.uri": "/api/file/upload/:category",
 *      "optionJsx.ajax.download": "/api/file/download/:key",
 *      "optionJsx.ajax.params": {
 *          "category": "FIX:logo-item"
 *      }
 * }
 * ```
 *
 * ### 1. 生命周期
 *
 * |Hoc高阶周期|Mount初始化|Update更新|
 * |---|---|---|
 * |Ok|Ok|Ok|
 *
 * ### 2. 属性说明
 *
 * 该属性说明位于`optionJsx.config`节点中，即`jsx`中的`config`对象信息。
 *
 * |属性名|二级属性|源|类型|说明|
 * |:---|---|:---|:---|:---|
 * |value||props|Any|Ant Form给当前组件传入的值。|
 * |reference||props|React|父引用，遵循Zero Ui的规范，该变量为固定变量，引用父组件。|
 * |config|filekey|props|String|下载文件的文件主键（fileKey）。|
 * |config|limit|props|Number|上传文件的大小限制。|
 * |config|single|props|Boolean|单文件上传还是多文件上传。|
 * |ajax|uri|props|String|上传专用Ajax基础配置，POST。|
 * |ajax|download|props|String|生成的文件下载链接，GET。|
 * |ajax|params|props|Object|上传专用Ajax中的参数信息，支持标准解析，parser的应用。|
 * |fileList||state|Array|当前组件中已经上传的文件列表。|
 * |handler||state|Object|当前组件构造的`handler`信息。|
 * |$counter||state|Number|已上传的文件数量。|
 *
 * ### 3. 组件核心点
 *
 * （略）后续补充
 *
 * @memberOf module:web-input
 * @method FileUpload
 */
// =====================================================
// componentInit/componentUp
// =====================================================
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
    Ux.parallel(value.map(file => {
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
    return Ux.parallel(promises);
};
const componentInit = (reference) => {
    const handler = Op.onHandler(reference);
    const callback = (fileList) =>
        reference.setState({
            handler, // 构造的Handler
            fileList, // 已上传文件内容
            $counter: fileList.length // 已上传文件数量
        });
    const {value = [], listType} = reference.props;
    if ("picture-card" === listType) {
        if (Ux.isArray(value)) {
            _asyncDownload(reference, value) // 并行下载
                .then(_asyncPreview(reference, value)) // 并行转换URL
                .then(item => callback(item)); // 设置FileList
        }
    } else {
        callback(value);
    }
};

@component({
    "i18n.cab": require('./Cab.json'),
    "i18n.name": "UI",
    state: {
        fileList: [],
        $counter: 0
    }
})
class Component extends React.PureComponent {

    componentDidMount() {
        componentInit(this);
    }

    UNSAFE_componentWillReceiveProps(nextProps, nextState) {
        Ux.xtUnsafe(this, nextProps);
    }

    render() {
        return (
            <Input.Group className={"web-file-upload"}>
                {Rdr.renderFile(this)}
                {Rdr.renderPreview(this)}
            </Input.Group>
        );
    }
}

export default Component;