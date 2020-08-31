import {message} from "antd";
import Abs from "../abyss";
import U from 'underscore';

/**
 * ## 标准函数
 *
 * Ant Design 中的 `message` 响应消息调用，内部调用 `message.success`。
 *
 * 1. 如果 content 是 String，则直接呈现该消息。
 * 2. 如果 content 是 Object，则提取 `model.success` 节点中的消息（旧代码兼容）。
 *
 * @memberOf module:_message
 * @param {String|Object} content 消息呈现的内容
 * @param {Number} duration 消息显示的时间，以秒为单位
 */
const messageSuccess = (content = "", duration = 1.628) => {
    if ("string" === typeof content) {
        message.config({maxCount: 1});
        message.success(content, duration);
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
/**
 * ## 标准函数
 *
 * Ant Design 中的 `message` 响应消息调用，内部调用 `message.error`。
 *
 * 1. 如果 content 是 String，则直接呈现该消息。
 * 2. 如果 content 是 Object，则提取 `model.failure` 节点中的消息（旧代码兼容）。
 *
 *
 * @memberOf module:_message
 * @param {String|Object} content 消息呈现的内容
 * @param {Number} duration 消息显示的时间，以秒为单位
 */
const messageFailure = (content = "", duration = 1.628) => {
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
/**
 * ## 特殊函数「Zero」
 *
 * 和 Zero 框架中的数据规范配合的异常处理函数，Zero中的异常规范如下，code 为 Zero 的内部错误代码：
 *
 * ```json
 * {
 *     "code": -100017,
 *     "message": "异常系统消息",
 *     "info": "可读的界面交互信息"
 * }
 * ```
 *
 * @memberOf module:_message
 * @param {Object} error Zero中的异常对象。
 * @param {Function} callback 异常信息处理过后的回调函数。
 */
const messageCatch = (error = {}, callback) => {
    const {data = {}} = error;
    console.error(error);   // 调试专用
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