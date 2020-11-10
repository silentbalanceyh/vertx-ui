import React from "react";
import Dev from '../develop';
import U from "underscore";
import Abs from "../abyss";
import {Progress} from 'antd';
import Eng from "../engine";

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
        const {component: Component} = LOG;
        if (Component) {
            /* 提供了加载组件 */
            return (<Component/>);
        } else {
            return (<Progress percent={62.8}
                              size={"small"}
                              status={"active"}
                              style={{
                                  width: "60%"
                              }}/>);
        }
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
    let isTouch;
    const {form} = reference.props;
    if (form) {
        isTouch = form.isFieldsTouched();
    } else {
        isTouch = false;
    }
    if (!isTouch) {
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
    }
};

const _xtRevert = (reference, callback = {}) => {
    /*
     * prevValue（之前的值）
     * curValue（之后的值）
     */
    const ref = Eng.onReference(reference, 1);
    if (ref) {
        /*
         * 传入了 reference 变量
         */
        const {form} = ref.props;
        if (form) {
            const isTouched = form.isFieldsTouched();
            const {value, onChange} = reference.props;
            if (isTouched) {
                console.debug("ANT-FORM, touched = true");
            } else {
                console.debug("ANT-FORM, touched = false");
                /*
                 * 重置
                 */
                if (Abs.isFunction(onChange)) {
                    onChange(value);
                    /*
                     * 外置函数
                     */
                    if (Abs.isFunction(callback.reset)) {
                        callback.reset(value);
                    }
                }
            }
        } else {
            console.debug("NO-FORM");
            /*
             * 非直接自定义控件
             */
        }
    } else {
        /*
         * 没有传入 reference 变量
         */
        console.debug("NO-REF, reference = null");
    }
}
/**
 * ## 标准函数
 *
 * 自定义组件的新重置处理，用于设置表单的重置相关信息
 *
 * @memberOf module:_xt
 * @param {ReactComponent} reference React组件引用。
 * @param {Object} virtualRef 带有state和props的前一次状态信息。
 * @param {Function} callback 回调函数处理。
 */
const xtRevert = (reference, virtualRef, callback = {}) => {
    const {readOnly = false} = reference.props;
    if (!readOnly) {
        const prevValue = virtualRef.props.value;
        const curValue = reference.props.value;
        if (Abs.isObject(prevValue) || Abs.isObject(curValue)) {
            /*
             * 数据结构是 Object 或 Array
             */
            if (Abs.isDiff(prevValue, curValue)) {
                _xtRevert(reference, callback);
            }
        } else {
            if (prevValue !== curValue) {
                _xtRevert(reference, callback);
            }
        }
    } else {
        /**
         * ReadOnly 的情况下，不执行任何重置，因为不会被改变
         */
    }
}
export default {
    xtRender,
    xtReady,
    xtReset,
    xtRevert,
};