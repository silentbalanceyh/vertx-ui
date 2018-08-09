import React from 'react';
import Prop from '../Ux.Prop';
import State from '../Ux.State';
import U from 'underscore';
import E from '../Ux.Error';
import Cv from '../Ux.Constant';
import Value from '../Ux.Value';
import Type from '../Ux.Type';
import Layout from './AI.Layout';
import {Button, Icon} from 'antd';
import Immutable from 'immutable';
import Ux from "ux";

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
const ai2Submit = (Op = {}) => (reference, jsx = {}) => {
    if (!jsx.op) return false;
    return (jsx.op.map(each => (
        <Button key={each} id={each} onClick={E.fxSubmit(reference, Op, each)}/>
    )))
};
const aiSubmit = (reference, Op = {}, hidden) => {
    const submit = Prop.fromHoc(reference, "submit");
    if (!submit || !U.isArray(submit)) return false;
    const className = hidden ? "ux-hidden" : "";
    return submit.map(each => (
        <Button key={each} className={className}
                id={each} onClick={E.fxSubmit(reference, Op, each)}/>
    ));
};
const ai2Event = (reference, fnSuccess, fnFailure) => (event) => E.fxForm(reference, (form) => {
    event.preventDefault();
    State.rdxSubmitting(reference, true);
    const {$inited} = reference.props;
    form.validateFieldsAndScroll((error, values) => {
        if (error) {
            State.rdxSubmitting(reference, false);
            if (fnFailure && U.isFunction(fnFailure)) {
                fnFailure(error);
            }
            return;
        }
        const params = Immutable.fromJS(values).toJS();
        params.language = Cv['LANGUAGE'];
        // 应用专用数据
        const {$app} = reference.props;
        if ($app && $app.is()) {
            params.sigma = $app._("sigma");
        }
        params.active = !!values.active;
        if ($inited) params.key = $inited.key;
        Value.valueValid(params);
        if (fnSuccess && U.isFunction(fnSuccess)) {
            const {fnMock} = reference.props;
            if (fnMock) {
                fnSuccess(params, fnMock(params));
            } else {
                fnSuccess(params);
            }
        }
    });
});

const aiFormButton = (reference, onClick, id = false) => {
    if (onClick) {
        const {$inited = {}} = reference.props;
        const key = (id) ? $inited.key : "";
        const buttons = [];
        Type.itObject(onClick, (field, fn) => {
            const item = {};
            const clientId = `${field}${key}`;
            item.key = clientId;
            item.id = clientId;
            item.onClick = fn(reference);
            buttons.push(item);
        });
        console.info(buttons);
        return (
            <span>
                {buttons.map(item => (<Button className={"ux-hidden"} {...item}/>))}
            </span>
        )
    }
};

const aiOp = (reference) => (Op) => Object.keys(Op).filter(key => U.isFunction(Op[key])).map(key => (
    <Button className={"ux-hidden"} key={key} id={key} onClick={Op[key](reference)}/>
));

const ai2FormButton = (Op, id = false) => ({$button: (reference) => aiFormButton(reference, Op, id)});
const ai2FilterButton = (window = 1) => {
    return {
        $button: (reference) => {
            const button = Prop.fromHoc(reference, "button");
            return (1 / 3 === window) ? Layout.aiColumns([7, 14],
                undefined,
                <Button.Group>
                    <Button type={"primary"} icon={"search"}
                            onClick={() => Ux.irFilter(reference)}>{button.search}</Button>
                    <Button icon={"reload"} onClick={Ux.irClear(reference)}>{button.clear}</Button>
                </Button.Group>
            ) : false
        }
    }
};
export default {
    ai2Event,
    // 表单2阶按钮
    ai2Submit,
    aiFormButton,
    ai2FormButton,
    ai2FilterButton,
    // 表单1阶按钮
    aiSubmit,
    aiButton,
    aiButtons,
    // 直接按钮处理
    aiOp,
    aiToolbars
}