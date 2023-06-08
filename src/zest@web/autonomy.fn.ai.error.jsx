import React from 'react';
import __Zn from './zero.module.dependency';
import {LoadingAlert} from "zone";

const Cv = __Zn.Env;

const aiErrorInput = (reference, condition = true) => {
    const field = reference.props[Cv.K_NAME.$DATA_FIELD];
    if (condition && field) {
        if (field.errors && 0 < field.errors.length) {
            const error = field.errors[0];
            if (error) {
                const message = error.message;
                if (message) {
                    return (
                        <div className={"web-error"}>
                            {message}
                        </div>
                    )
                } else {
                    /*
                     * 未配置 message
                     */
                    console.error("[ Xt ] Error：未配置 message 节点，验证问题！", error);
                    return false;
                }
            } else {
                /*
                 * 错误提取失败
                 */
                return false;
            }
        } else {
            /*
             * 验证无错
             */
            return false;
        }
    } else {
        /*
         * 外置条件不满足
         */
        return false;
    }
};
const aiErrorPage = (error = {}) => {
    return (
        <div style={{
            paddingTop: "10%",
            paddingLeft: "20%",
            paddingRight: "20%"
        }}>
            <LoadingAlert $alert={error}
                          $icon={"stop"} $type={"error"}/>
        </div>
    )
}
export default {
    aiErrorInput,
    aiErrorPage,
}