import U from "underscore";
import {Modal} from "antd";
import E from "../../error";

/**
 * @class Global
 * @description 全局专用业务函数
 */
const eventConfirm = (fnEvent, content) => (event) => {
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
    eventConfirm
}