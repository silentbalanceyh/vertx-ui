import {Progress} from "antd";
import React from "react";
import __Zn from './zero.module.dependency';

const xtRender = (reference, render) => {
    const {error} = reference.state ? reference.state : {};
    if (error) {
        console.error(error);
        if ("string" === typeof error) {
            return __Zn.fxFailure(error); // _jsxError(error);
        } else {
            let message = ``;
            if (error.code) {
                message = `${error.code} ${error.error}`
            }
            return __Zn.fxFailure(message); // _jsxError(message);
        }
    } else {
        if (reference.state) {
            return render();
        } else {
            return false;
        }
    }
};

const xtReady = (reference, render, LOG = {}) => {
    const {$ready = false, $error} = reference.state ? reference.state : {};
    if ($error) {
        return (
            <div className={"ux_error_input"}>
                {$error}
            </div>
        )
    }
    if ($ready) {
        const {color = "#4682B4", name = "", logger = false} = LOG;
        if (logger) {
            const {$visible = false} = reference.state;
            if (LOG.force || ($visible && name)) {
                __Zn.dgDebug(reference.state, `[ Xt ] 自定义组件 ${name} 初始化完成时的状态`, color);
            }
        }
        return xtRender(reference, render);
    } else {
        const {component: Component} = LOG;
        if (Component) {
            /* 提供了加载组件 */
            return (<Component/>);
        } else {
            return (<Progress percent={62.8}
                              size={"small"}
                              status={"active"}
                              style={{width: "100%"}}/>);
        }
    }
};
export default {
    xtReady,
    xtRender,
}