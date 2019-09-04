import Eng from "../engine";
import {message, Modal} from "antd";
import Ut from '../unity';
import Abs from '../abyss';
import E from '../error';
import U from 'underscore';
/*
 * 专用窗口响应方法，用于返回 failure 窗口
 * reference 必须绑定了 Cab
 */
const ajaxError = (reference, error = {}) => {
    const {data = {}} = error;
    if (data.info) {
        const dialog = Eng.fromHoc(reference, "dialog");
        const config = {
            title: dialog.error, content: data.info,
            maskClosable: false,
        };
        config.onOk = () => reference.setState({$loading: false});
        Modal.error(config);
    } else {
        console.error("[ Ux ] 核心错误！", error);
    }
};

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
const ajax2Dialog = (reference, key) => (data) =>
    ajaxDialog(reference, {key, data});
const ajaxDialog = (reference, {
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
        dialogConfig.content = Ut.formatExpr(dialogConfig.pattern, data);
    }
    return _showDialog(reference, dialogConfig, data);
};
const ajax2True = (consumer, content) => (result) => {
    if (result) {
        if (U.isFunction(consumer)) {
            consumer();
            if (content) {
                messageSuccess(content);
            }
            return Abs.promise(result);
        } else {
            return E.fxReject(10106);
        }
    } else {
        return E.fxReject(10107);
    }
};
const messageSuccess = (content = "") => {
    if ("string" === typeof content) {
        message.config({maxCount: 1});
        message.success(content, 1.2);
    } else if (Abs.isObject(content)) {
        const {modal: {success = {}}} = content;
        /*
         * 递归调用
         */
        if ("string" === typeof success.content) {
            messageSuccess(success.content);
        }
    } else {
        console.warn("[ Ux ] 没有被显示的成功消息：", content);
    }
};

const messageFailure = (content = "") => {
    if ("string" === typeof content) {
        message.config({maxCount: 1});
        message.success(content, 1.2);
    } else if (Abs.isObject(content)) {
        const {modal: {error = {}}} = content;
        /*
         * 递归调用
         */
        if ("string" === typeof error.content) {
            messageFailure(error.content);
        }
    } else {
        console.warn("[ Ux ] 没有被显示的失败消息：", content);
    }
};
export default {
    ajaxError,
    ajaxDialog,
    ajax2Dialog,    // 2阶
    ajax2True,      // 2阶
    messageSuccess,
    messageFailure
}