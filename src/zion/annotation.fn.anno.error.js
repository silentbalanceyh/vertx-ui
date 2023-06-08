import __Zn from './zero.module.dependency';
import {LoadingAlert} from "zone";
import React from 'react';

const annoError = (reference, error = {}) => {
    // 外层属性
    const divAttrs = {};
    divAttrs.style = {
        paddingBottom: "12%"
    }
    divAttrs.className = "ux_error_page"

    // Alert专用属性

    // ========================== $alert / $icon 处理
    const {alert = {}} = error.data ? error.data : {};
    const {$hoc} = reference.state;
    const fatal = $hoc ? $hoc._("_fatal") : {};
    const {run = {}} = fatal;

    const config = {};
    config.$icon = alert.icon ? alert.icon : "stop";
    config.$type = alert.type ? alert.type : "error";

    // 主体消息部分处理
    const $alert = {};
    /*
     * message
     * 1. 优先级最高：        编程传入 alert.message
     * 2. 次级优先级：        fatal.run.message
     */
    if (alert.message) {
        $alert.message = alert.message;
    } else {
        $alert.message = run.message;
    }
    /*
     * description
     * 1. 优先级高：          编程传入 alert.description
     * 2. 次级优先级：        fatal.run.description
     * 3. 追加：
     *                      rest.status = status + " " + statusCode
     *                      rest.message（系统信息）
     */
    const fnArray = (input) => {
        if (__Zn.isArray(input)) {
            return __Zn.clone(input);
        } else {
            return __Zn.clone([input]);
        }
    }
    let description = [];
    if (alert.description) {
        description = fnArray(alert.description);
    } else {
        if (__Zn.isArray(error)) {
            description = error;
        } else if ("string" === typeof error) {
            description = [error];
        } else if (__Zn.isObject(error)) {
            if (run.description) {
                description = description.concat(run.description);
            }
            if (error.message) {
                description.push(`Error Detail: ${error.message}`);
            }
        }
    }
    $alert.description = description;
    config.$alert = $alert;
    return (
        <div {...divAttrs}>
            <LoadingAlert {...config}/>
        </div>
    )
}
const annoFailed = (error) => {
    let message;
    if (__Zn.isObject(error, true)) {
        message = __Zn.wayO2S(error);
    } else {
        message = "Failed"
    }
    const messageContent = __Zn.fxError(10108, message);
    return __Zn.fxFailure(messageContent);
}
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    annoError,
    annoFailed,
}