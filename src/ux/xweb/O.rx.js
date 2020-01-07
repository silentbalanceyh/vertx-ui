import U from 'underscore';

import E from '../error';
import Cv from '../constant';
import React from "react";
import Dev from '../develop';

const xtRxInit = (reference = {}, fnName, params) => {
    E.fxTerminal("string" !== typeof fnName, 10100, fnName);
    // 默认组件的模式都是取的Reactive
    const {$category = Cv.RX_SOURCE.REACTIVE} = reference.props;
    // 只有Reactive模式下才调用绑定好的fnName对应的Reactive方法，则组件具有二义性
    if (Cv.RX_SOURCE.REACTIVE === $category) {
        const rxFun = reference.props[fnName];
        // 第三参为可选参数
        if (U.isFunction(rxFun)) {
            rxFun(params);
        }
    }
};
const jsxError = (message) => (
    <div className={"ux-error"}>
        {message}
    </div>
);
const xtRender = (reference, render) => {
    const {error} = reference.state ? reference.state : {};
    if (error) {
        console.error(error);
        if ("string" === typeof error) {
            return jsxError(error);
        } else {
            let message = ``;
            if (error.code) {
                message = `${error.code} ${error.error}`
            }
            return jsxError(message);
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
    const {$ready = false} = reference.state ? reference.state : {};
    if ($ready) {
        const {color = "#4682B4", name = "", logger = false} = LOG;
        if (logger) {
            const {$visible = false} = reference.state;
            if ($visible && name) {
                Dev.dgDebug(reference.state, `[ Xt ] 自定义组件 ${name} 初始化完成时的状态`, color);
            }
        }
        return xtRender(reference, render);
    } else {
        return false;
    }
};
export default {
    xtRxInit,
    xtRender,
    xtReady,
};