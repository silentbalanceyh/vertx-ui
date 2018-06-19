import React from 'react';
import Prop from '../Ux.Prop';
import U from 'underscore';
import {Button} from 'antd';

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
            console.info(values);
            // 如果是单函数，可不开启二次提交，直接设置成false
            if (U.isFunction(callback)) {
                state['$ai_submitting'] = true;
                reference.setState(state);
                callback(values, reference);
            } else {
                // 如果是对象，则分validate, promise, resolve, reject
                if (U.isFunction(callback.validate)) {
                    values = callback.validate(values, reference);
                }
                // 构造promise
                if (U.isFunction(callback.promise)) {
                    const promise = callback.promise(values, reference);
                    if (promise) {
                        promise.then(data => {
                            state['$ai_submitting'] = false;
                            reference.setState(state);
                            if (U.isFunction(callback.success)) {
                                callback.success(data, values, reference);
                            }
                        }).catch(error => {
                            state['$ai_submitting'] = false;
                            reference.setState(state);
                            if (U.isFunction(callback.reject)) {
                                callback.reject(error, values, reference);
                            }
                        })
                    }
                } else {
                    console.error("[ZI] You must provide 'promise' for this mode executing.");
                }
            }
        })
    } else {
        console.error("[ZI] The component is not wrapped by 'Ant Form'.")
    }
};
const aiButton = (reference, Op, key) => {
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
        return (
            <Button {...rest} onClick={onClick}>{text}</Button>
        )
    } else {
        console.error(`[ZI] Missed '${key}' of '_form -> buttons' configuration.`);
    }
};
const aiButtons = (reference, jsx = {}, Op, ...key) => {
    if (!jsx.hasOwnProperty('onFocus')) delete jsx['fnFocus'];
    if (!jsx.hasOwnProperty('onBlur')) delete jsx['fnBlur'];
    return (<div {...jsx}>
        {key.map(key => aiButton(reference, Op, key))}
    </div>)
};
export default {
    aiButton,
    aiButtons
}