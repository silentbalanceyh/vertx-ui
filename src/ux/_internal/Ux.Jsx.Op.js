import React from "react";
import {Button} from 'antd';
import Ux from 'ux';
import U from 'underscore';
import Immutable from "immutable";
import Value from "../Ux.Value";

const _rtFun = (reference = {}, op) => {
    const {$op} = reference.state;
    // 前置验证
    Ux.E.fxTerminal(!$op, 10073, $op);
    Ux.E.fxTerminal(!$op[op], 10017, "onClick");
    Ux.E.fxTerminal(!U.isFunction($op[op]), 10047, op, $op[op]);
    const metadata = {};
    metadata.success = $op[op];
    // 前置验证
    const failureKey = `${op}Failure`;
    if (U.isFunction($op[failureKey])) {
        metadata.failure = $op[failureKey];
    }
    Object.keys(metadata).filter(key => U.isFunction(metadata[key]))
        .map(key => metadata[key] = metadata[key](reference));
    return metadata;
};

const _rt2Submit = (reference = {}, metadata = {}) => (event) => {
    event.preventDefault();
    const {op} = metadata;
    const callback = _rtFun(reference, op);
    _rtSubmit(reference, callback);
};

const _rtError = (reference = {}, failure) => (errors = {}) => {
    const {data = {}} = errors;
    // 如果有自定义的failure函数，则调用failure
    if (U.isFunction(failure)) {
        failure(errors);
        reference.setState({$loading: false});
    } else {
        if (data.info) {
            Ux.showError(reference, data.info, () => reference.setState({$loading: false}));
        }
    }
};

const _rtState = (reference, loading = true) => {
    reference.setState({$loading: loading});
    Ux.rdxSubmitting(reference, loading);
};

const rtSubmit = (reference = {}, success, failure) => _rtSubmit(reference, {success, failure});

const _rtSubmit = (reference = {}, callback = {}) => {
    const {form} = reference.props;
    Ux.E.fxTerminal(!form, 10020, form);
    Ux.E.fxTerminal(!callback.success, 10017, "success");
    if (form) {
        _rtState(reference);
        form.validateFieldsAndScroll((error, values) => {
            if (error) {
                _rtState(reference, false);
            } else {
                const params = Immutable.fromJS(values).toJS();
                params.language = Ux.Env['LANGUAGE'];
                // 去掉undefined
                Value.valueValid(params);
                // 默认的fnFail函数
                if (callback.success) {
                    const executor = callback.success(values);
                    if (Promise.prototype.isPrototypeOf(executor)) {
                        // Promise Async
                        executor.then(() => {
                            if (!reference.isUnmount()) {
                                _rtState(reference, false);
                            }
                        }).catch(_rtError(reference, callback.failure));
                    } else {
                        _rtState(reference, false);
                    }
                } else {
                    _rtState(reference, false);
                }
            }
        })
    }
};
/**
 * Ant Form的提交专用按钮，其中会执行Ant Form的函数
 * metadata = {
 *     text: 按钮上显示的文字
 *     op: 按钮需要触发的绑定的key，从reference.state中提取
 *     ...rest：其他的是按钮支持函数
 * }
 */
const rtAnt = (reference, metadata = {}) => {
    const {$loading = false} = reference.state;
    const {text, ...rest} = metadata;
    return (
        <Button onClick={_rt2Submit(reference, metadata)}
                {...rest} loading={$loading}>
            {text ? text : false}
        </Button>
    );
};
const rtRet = (reference, metadata = {}) => {
    const {$loading = false} = reference.state;
    const {text, ...rest} = metadata;
    return (
        <Button onClick={() => Ux.formReset(reference)}
                {...rest} loading={$loading}>
            {text ? text : false}
        </Button>
    );
};
const _rtJsx = (reference, $op = {}, show = false) =>
    Object.keys($op).filter(key => !!key).filter(key => U.isFunction($op[key]))
        .map(key => <Button id={key} key={key}
                            onClick={$op[key](reference)} className={show ? "" : "ux-hidden"}/>);
const rtInherit = (reference, show = false) => {
    const {$op = {}} = reference.props;
    return _rtJsx(reference, $op, show);
};
const rtBind = (reference, show = false) => {
    const {$op = {}} = reference.state;
    return _rtJsx(reference, $op, show);
};
const rtNorm = (reference, jsx = {}) => {
    const buttons = jsx.buttons;
    Ux.E.fxTerminal(!buttons.hasOwnProperty("submit"), 10074, "submit");
    // 提交按钮
    const item = Ux.aiExprOp(buttons.submit);
    const reset = buttons.reset ? Ux.aiExprOp(buttons.reset) : false;
    return (
        <span>
            {rtAnt(reference,
                {
                    type: "primary", key: item.key,
                    text: item.text, op: item.id
                })}
            &nbsp;&nbsp;&nbsp;&nbsp;
            {reset ? rtRet(reference, {
                type: "default", key: reset.key,
                text: reset.text, op: reset.id
            }) : false}
        </span>
    );
};
// rx - Reactive Action
/**
 * 重定向专用链接按钮
 * metadata = {
 *     text: 按钮上显示的文字
 *     uri: 重定向的地址，包括/ima的前缀，环境变量中的设置
 * }
 */
const rtLink = (reference, metadata = {}) => {
    const {text, uri = "", loading, ...rest} = metadata;
    const attr = {};
    if (loading) {
        attr.loading = reference.state[loading];
    }
    return (
        <Button onClick={() => Ux.toRoute(reference, uri)} {...rest}
                {...attr}>
            {text ? text : false}
        </Button>
    )
};
export default {
    // 重置按钮专用
    rtRet,
    // Ant Design标准Form按钮
    rtAnt,
    // React Router按钮
    rtLink,
    // 自定义组件按钮，$op从props中出来，一般来自于父组件，默认隐藏
    rtInherit,
    // 自定义组件按钮，$op从state中出来，一般来源于当前组件的bind方法
    rtBind,
    // 自定义组件按钮，$op从state中出来，一般是：提交、重置，提交为Ant Design的标准按钮
    // 配置文件来源于optionJsx.buttons，并且hidden必须是false默认值（不隐藏的）
    rtNorm,
    // 直接提交函数，封装了防重复提交
    rtSubmit
}