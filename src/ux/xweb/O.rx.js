import React from "react";
import Dev from '../develop';

const jsxError = (message) => (
    <div className={"ux-error"}>
        {message}
    </div>
);
/**
 * ## 标准函数
 *
 * 检查系统状态内部是否存在`error`节点，如果存在`error`节点，则直接渲染错误信息，配置出错的统一调用流程。
 *
 * @memberOf module:_xt
 * @param {ReactComponent} reference React组件引用。
 * @param {Function} render 执行 render 的函数。
 * @return {Jsx|boolean} 直接渲染。
 */
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
/**
 * ## 标准函数
 *
 * 由于 Zero 框架无法调用 Extension 中的`yoRender`，所以可直接使用`xtReady` 实现和 `yoRender`中
 * 同样的逻辑
 *
 * 1. 检查配置是否准备完成，如果准备完成：`$ready = true`，否则为false。
 * 2. 准备没有完成时，则不渲染。
 *
 * @memberOf module:_xt
 * @param {ReactComponent} reference React组件引用。
 * @param {Function} render 执行 render 的函数。
 * @param {Object} LOG 日志配置。
 * @return {Jsx|boolean} 直接渲染。
 */
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
    xtRender,
    xtReady,
};