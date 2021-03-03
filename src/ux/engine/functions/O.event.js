import U from "underscore";
import {Modal} from "antd";
import E from "../../error";

/**
 * ## 「标准」`Ux.onConfirm`
 *
 * 基础函数，用于执行 confirm，在按钮中执行提交确认注入。
 *
 * 1. 如果带 content 则将原始函数处理在 onOk 回调中。
 * 2. 如果不带 content 则直接执行函数。
 *
 * @memberOf module:_ui
 * @param {Function} fnEvent 原始事件方法。
 * @param {String} content 提示框中的内容数据。
 * @returns {Function} 返回事件函数
 */
const onConfirm = (fnEvent, content) => (event) => {
    if (U.isFunction(fnEvent)) {
        event.preventDefault();
        if (content) {
            /* 带确认框 */
            Modal.confirm({
                content,
                onOk: () => fnEvent()
            })
        } else {
            /* 不带确认 */
            fnEvent();
        }
    } else {
        E.fxFatal(10105);
    }
};

export default {
    onConfirm,
}