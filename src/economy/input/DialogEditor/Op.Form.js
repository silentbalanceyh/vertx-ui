import Ux from 'ux';
import Event from "./Op.Event";
import React from "react";
import FormComponent from './form/UI';

const toInherit = (reference, $inited, $mode) => {
    const inherit = Event.yoInherit(reference);
    inherit.$inited = $inited;
    inherit.$mode = $mode;
    const {value} = reference.props;
    if (value) {
        inherit.value = value;
    }
    const {$renders} = reference.props;
    if ($renders) {
        inherit.$renders = $renders;
    }
    return inherit;
}
/*
 * fnComponent 的生成
 * 最终返回 Promise
 * 1）form = String：编程模式
 * 2）form = Object：直接配置模式
 * {
 *     "ui": [
 *
 *     ]
 * }
 * 3）form = Object：动态模式
 * {
 *     "code": "xxxx"
 * }
 * 直接通过函数转换成 Promise 处理
 */
export default (reference, config = {}, state = {}) => {
    const {form = {}} = config;
    /*
     * 读取 ref 引用，注：这里是 DialogEditor组件
     * 只有 ref 中可能包含需要使用的信息，包括 Ant Form 的引用绑定
     *
     */
    if ("string" === typeof form) {
        /*
         * 第一种配置：最早的原始配置，编程模式，表单组件从外置传入
         */
        const ref = Ux.onReference(reference, 1);
        if (ref) {
            // 提取表单组件的位置
            const {$form = {}} = ref.props;
            const Component = $form[form];
            if (Component) {
                state.fnComponent = ($inited = {}, $mode) => {
                    /*
                     * 传入的是值
                     */
                    const inherit = toInherit(reference, $inited, $mode);
                    return (
                        <Component {...inherit}/>
                    );
                };
                return Ux.promise(state);
            } else {
                console.error("编程模式：表单配置非法！", $form, form);
                state.error = `Component in dialog has been missed. key = ${form}`;
                return Ux.promise(state);
            }
        } else return Ux.promise(state);
    } else {
        if (form.hasOwnProperty("code")) {
            /*
             * 远程配置（后期处理）
             */
            return Ux.promise(state);
        } else {
            /*
             * 当前配置，可直接处理
             * 直接将 form 作为表单专用的 object 来处理
             */
            state.fnComponent = ($inited = {}, $mode) => {
                /*
                 * 传入的是值，并且对接 config 部分
                 */
                const inherit = toInherit(reference, $inited, $mode);
                inherit.config = form;
                return (
                    <FormComponent {...inherit} reference={reference}/>
                );
            };
            return Ux.promise(state);
        }
    }
}