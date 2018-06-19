import React from 'react';
import Prop from '../Ux.Prop';
import U from 'underscore';
import {Button, Icon} from 'antd';

const _aiSubmit = (reference, callback) => (event) => {
    event.preventDefault();
    const {form} = reference.props;
    if (form) {
        const state = {};
        state['$ai_submitting'] = true;
        reference.setState(state);
        form.validateFieldsAndScroll((error, values) => {
            if (error) {
                state['$ai_submitting'] = false;
                reference.setState(state);
                return;
            }
            // 如果是单函数，可不开启二次提交，直接设置成false
            if (U.isFunction(callback)) {
                state['$ai_submitting'] = true;
                reference.setState(state);
                callback(values, reference);
            } else {
                if (!U.isFunction(callback.promise)) {
                    console.error("[ZI] You must provide 'promise' for this mode executing.");
                    return;
                }
                // 如果是对象，则分validate, promise, resolve, reject
                if (U.isFunction(callback.validate)) {
                    values = callback.validate(values, reference);
                }
                if (values) {
                    // 构造promise
                    const promise = callback.promise(values, reference);
                    if (promise) {
                        promise.then(response => {
                            state['$ai_submitting'] = false;
                            reference.setState(state);
                            if (U.isFunction(callback.success)) {
                                callback.success(reference, response, values);
                            }
                        }).catch(error => {
                            state['$ai_submitting'] = false;
                            reference.setState(state);
                            if (U.isFunction(callback.reject)) {
                                callback.reject(reference, error, values);
                            }
                        })
                    }
                } else {
                    state['$ai_submitting'] = false;
                    reference.setState(state);
                }
            }
        })
    } else {
        // 非Form中的按钮
        if (callback) {
            callback(event)
        } else {
            console.error("[ZI] The component is not wrapped by 'Ant Form'.")
        }
    }
};
const aiButton = (reference, Op, key, disabled = false) => {
    let form = Prop.fromHoc(reference, "_form");
    const button = form.buttons;
    if (button && button.hasOwnProperty(key)) {
        // 函数绑定
        let fun = Op[key];
        if (!U.isFunction(fun)) {
            console.error(`[ZI] The key=${key} of input 'Op' must be 2nd level function.`);
            return false;
        }
        fun = fun(reference);
        const onClick = _aiSubmit(reference, fun);
        // 属性处理
        const target = button[key];
        const attrs = {};
        if ("string" === target) {
            attrs.text = target;
        } else {
            Object.assign(attrs, target);
        }
        const {text = "", ...rest} = attrs;
        if (!rest.hasOwnProperty('key')) rest.key = key;
        if (!rest.hasOwnProperty('id')) rest.id = key;
        // 针对icon的左右处理
        const {iconRight, ...jsx} = rest;
        if (iconRight) {
            const {icon, ...jsxLeft} = jsx;
            return (
                <Button {...jsxLeft} onClick={onClick} disabled={disabled}>
                    {text}
                    <Icon type={icon}/>
                </Button>
            )
        } else {
            return (
                <Button {...jsx} onClick={onClick} disabled={disabled}>{text}</Button>
            )
        }
    } else {
        console.error(`[ZI] Missed '${key}' of '_form -> buttons' configuration.`);
    }
};
const aiButtons = (reference, jsx = {}, Op, ...key) => {
    if (!jsx.hasOwnProperty('onFocus')) delete jsx['fnFocus'];
    if (!jsx.hasOwnProperty('onBlur')) delete jsx['fnBlur'];
    const {disabled = [], ...rest} = jsx;
    return (<div {...rest}>
        {key.map((key, index) => aiButton(reference, Op, key, disabled[index]))}
    </div>)
};
const aiToolbars = (reference, jsx = {}, Op, ...key) => {
    if (!jsx.hasOwnProperty('onFocus')) delete jsx['fnFocus'];
    if (!jsx.hasOwnProperty('onBlur')) delete jsx['fnBlur'];
    const {disabled = [], ...rest} = jsx;
    return (<Button.Group {...rest}>
        {key.map((key, index) => aiButton(reference, Op, key, disabled[index]))}
    </Button.Group>)
};
export default {
    aiButton,
    aiButtons,
    aiToolbars
}