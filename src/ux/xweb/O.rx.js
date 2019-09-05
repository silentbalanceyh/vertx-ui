import U from 'underscore';

import E from '../error';
import Cv from '../constant';
import React from "react";

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
        return jsxError(error);
    } else {
        if (reference.state) {
            return render();
        } else {
            return false;
        }
    }
};
export default {
    xtRxInit,
    xtRender,
};