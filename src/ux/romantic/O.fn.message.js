import Cmn from "./I.common";
import Abs from "../abyss";
import {message} from "antd";

/**
 * ## 特殊函数「Zero」
 *
 * 该函数和模态框的窗口配置没太大的，区别，核心结构如下，唯一的区别是响应过后不使用模态框，直接使用`message`消息框。
 *
 * ```json
 * {
 *     "_modal":{
 *         "success":{
 *             "key1": "message1"
 *         },
 *         "error":{
 *             "key2": "message2"
 *         },
 *         "confirm":{
 *             "key3": "message3"
 *         }
 *     }
 * }
 * ```
 *
 * @memberOf module:_romantic
 * @method sexMessage
 * @param {ReactComponent} reference React组件引用。
 * @param {String} key 配置键值。
 * @param {Number} duration 消息停留的时间。
 */
export default (reference, key = "", duration = 1.2) => {
    const seek = Cmn.cabModal(reference, key);
    if (Abs.isObject(seek)) {
        const {type, ...config} = seek;
        message.destroy();
        message.config({maxCount: 1});
        if ("error" === type) {
            message.error(config.content, duration);
        } else if ("success" === type) {
            message.success(config.content, duration);
        }
    } else {
        console.error("[ Ox ] 缺少窗口配置：_modal 或者配置解析出错！")
    }
}