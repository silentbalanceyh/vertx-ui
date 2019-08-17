import Ux from 'ux';
import {Modal} from 'antd';

const _setType = (config = {}, modal = {}, key) => {
    if (modal.confirm && modal.confirm.hasOwnProperty(key)) {
        config.mode = "confirm";
        config.pattern = modal.confirm[key];
    }
    if (modal.error && modal.error.hasOwnProperty(key)) {
        config.mode = "error";
        config.pattern = modal.error[key];
    }
    if (modal.success && modal.success.hasOwnProperty(key)) {
        config.mode = "success";
        config.pattern = modal.success[key];
    }
    if (!config.mode || !config.pattern) {
        console.error(`窗口配置 _modal 中无法找到 ${key}`);
    }
};
const _showDialog = (reference, dialogConfig = {}, data) => {
    const {title, content, mode} = dialogConfig;
    const config = {title, content, maskClosable: false, destroyOnClose: true};
    const FUN = {
        "success": Modal.success,
        "error": Modal.error,
        "confirm": Modal.confirm,
    };
    const fnDialog = FUN[mode];
    config.onCancel = () => reference.setState({$loading: false});
    return new Promise((resolve) => {
        config.onOk = () => {
            reference.setState({$loading: false});
            resolve(data)
        };
        fnDialog(config);
    })
};
export default (reference, {
    data, key
}) => {
    const {config = {}} = reference.props;
    const {dialog = {}} = config;
    /*
     * modal:{
     *      confirm: （ 第一优先级 ）
     *      error:   （ 第二优先级 ）
     *      success: （ 第三优先级 ）
     * }
     */
    const {modal, title = {}} = dialog;
    const dialogConfig = {};
    _setType(dialogConfig, modal, key);
    dialogConfig.title = title[dialogConfig.mode];
    /*
     * 使用数据执行 format
     */
    if (dialogConfig.pattern) {
        dialogConfig.content = Ux.formatExpr(dialogConfig.pattern, data);
    }
    return _showDialog(reference, dialogConfig, data);
};