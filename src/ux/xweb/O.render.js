import React from "react";
import Dev from '../develop';
import U from "underscore";
import Abs from "../abyss";
import {Progress} from 'antd';

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
            if (LOG.force || ($visible && name)) {
                Dev.dgDebug(reference.state, `[ Xt ] 自定义组件 ${name} 初始化完成时的状态`, color);
            }
        }
        return xtRender(reference, render);
    } else {
        return (<Progress percent={62.8}
                          size={"small"}
                          status={"active"}
                          style={{
                              width: "60%"
                          }}/>);
    }
};

const isDiff = (left, right) => {
    const leftType = typeof left;
    const rightType = typeof right;
    if (leftType === rightType) {
        // 相同类型才能比较
        if (U.isArray(left) || U.isObject(left)) {
            return Abs.isDiff(left, right);
        } else {
            return left !== right;
        }
    } else {
        // 类型不同则二者不同
        return true;
    }
};

/**
 * ## 标准函数
 *
 * 重置专用函数，内部关联 Ant Design 的 Form信息。
 *
 * @memberOf module:_xt
 * @method xtReset
 * @param {ReactComponent} reference React组件引用。
 * @param {Object} virtualRef 带有state和props的前一次状态信息。
 * @param {Function} callback 回调函数处理。
 */
const xtReset = (reference, virtualRef = {}, callback) => {
    /*
     * 三个值相互比较
     */
    const current = reference.props.value;
    const original = virtualRef.props.value;
    /*
     * 这是标准自定义控件中会存在的内容
     */
    if (reference.props.hasOwnProperty("data-__meta")) {
        const metadata = reference.props['data-__meta'];
        const initial = metadata.initialValue;
        if (isDiff(current, original) && !isDiff(current, initial)) {
            callback(initial);
        }
    }
};
export default {
    xtRender,
    xtReady,
    xtReset,
};