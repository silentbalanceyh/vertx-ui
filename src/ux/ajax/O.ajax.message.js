import {message} from "antd";
import Abs from "../abyss";
import U from 'underscore';

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

const messageFailure = (content = "", duration = 1.2) => {
    if ("string" === typeof content) {
        message.config({maxCount: 1});
        message.error(content, duration);
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

const messageCatch = (error = {}, callback) => {
    const {data = {}} = error;
    if (data.info) {
        messageFailure(data.info, 2);
    } else {
        if (data.message) {
            messageFailure(data.message, 2);
        }
    }
    if (U.isFunction(callback)) {
        callback();
    }
};

export default {
    messageSuccess,
    messageFailure,
    messageCatch
}