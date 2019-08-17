import Ux from 'ux';
import Op from './Op.Event';

const yiEditor = (reference) => {
    const {config = {}} = reference.props;
    const state = {};
    /*
     * notice 专用
     */
    const {notice = {}, upload = {}, button = ""} = config;
    state.$notice = Ux.clone(notice);
    /*
     * 上传配置处理
     */
    state.$upload = {
        control: {
            listType: "picture-card",
            accept: ".xls,.xlsx",   // Excel
            beforeUpload: Op.rxBeforeUpload(reference),    // 禁用
            onChange: Op.rxChange(reference),
            onRemove: Op.rxRemove(reference),
            // customRequest: Op.rxCustomRequest(reference)
        },
        imageAlt: "Template File",
        textClass: "ant-upload-text",
        text: upload
    };
    /*
     * 按钮配置
     */
    if ("string" === typeof button) {
        const $button = {};
        $button.id = button;
        $button.className = "ux-hidden";
        $button.onClick = Op.rxImport(reference);
        state.$button = $button;
    }
    state.$ready = true;
    reference.setState(state);
};
export default {
    yiEditor
}