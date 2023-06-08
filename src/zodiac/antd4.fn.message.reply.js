import __Zn from './zero.module.dependency';
import {message} from "antd";

const messageConfirm = (content, onOk, width = 600) => {
    const md = __Zn.v4Modal()
    md.confirm({
        content,
        width,
        onOk
    })
};
const messageSuccess = (content = "", duration = 1.628) => {
    if ("string" === typeof content) {
        const ms = __Zn.v4Message();
        message.config({maxCount: 1});
        ms.success(content, duration);
    } else if (__Zn.isObject(content)) {
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

const messageFailure = (content = "", duration = 1.628) => {
    if ("string" === typeof content) {
        const ms = __Zn.v4Message();
        message.config({maxCount: 1});
        ms.error(content, duration);
    } else if (__Zn.isObject(content)) {
        const {modal} = content;
        /*
         * 递归调用
         */
        const {error = {}} = modal ? modal : {};
        if ("string" === typeof error.content) {
            messageFailure(error.content);
        }
    } else {
        console.warn("[ Ux ] 没有被显示的失败消息：", content);
    }
};

const messageCatch = (error = {}, callbackFn) => {
    const {data = {}} = error;
    // console.error(error);   // 调试专用
    if (data.info) {
        messageFailure(data.info, 2);
    } else {
        if (data.message) {
            messageFailure(data.message, 2);
        }
    }
    if (__Zn.isFunction(callbackFn)) {
        callbackFn();
    }
};
export default {
    messageSuccess,
    messageFailure,
    messageCatch,
    messageConfirm
}
