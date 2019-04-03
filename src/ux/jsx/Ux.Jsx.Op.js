import React from "react";
import {Button, Tooltip} from 'antd';
import Ux from 'ux';
import U from 'underscore';
import Value from '../Ux.Value';
import Ai from '../ai/AI';

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
                const params = Value.clone(values);
                params.language = Ux.Env['LANGUAGE'];
                // 去掉undefined
                Value.valueValid(params);
                // 默认的fnFail函数
                if (callback.success) {
                    const executor = callback.success(values);
                    if (Promise.prototype.isPrototypeOf(executor)) {
                        // Promise Async
                        executor.then(() => {
                            if (U.isFunction(reference.isUnmount) && !reference.isUnmount()) {
                                _rtState(reference, false, params);
                            }
                        }).catch(_rtError(reference, callback.failure));
                    } else {
                        Ux.E.fxTerminal(true, 10078, "Non Promise");
                        // Non Promise Mode
                        // _rtState(reference, false);
                        // _rtState(reference, false);
                    }
                } else {
                    _rtState(reference, false);
                }
            }
        });
    }
};
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
    console.info(errors);
    if (U.isFunction(failure)) {
        failure(errors);
        _rtState(reference, false);
    } else {
        if (data.info) {
            Ux.showError(reference, data.info, () => _rtState(reference, false));
        }
    }
};

const _rtState = (reference, loading = true, params) => {
    reference.setState({$loading: loading});
    Ux.rdxSubmitting(reference, loading);
    if (params) {
        Ux.D.connectSubmit(reference, params);
    }
};

const _rxClick = (reference, item = {}) => {
    const {$op = {}} = reference.state;
    Ux.E.fxTerminal(!U.isFunction($op[item.key]), 10077, $op, item.key);
    // 带提交的直接函数
    const {form} = reference.props;
    Ux.E.fxTerminal(!form, 10020, form);
    const fnExecutor = $op[item.key](reference);
    return (event) => {
        event.preventDefault();
        if ("DIRECT" === item["submit"]) {
            if (form) {
                form.validateFieldsAndScroll((error, values) => {
                    if (!error) {
                        /**
                         * 第二参注定后续流程
                         */
                        fnExecutor(values);
                    }
                });
            }
        } else {
            // 纯函数
            fnExecutor(event, form);
        }
    };
};
const rtSubmit = (reference = {}, success, failure) => _rtSubmit(reference, {
    success,
    failure
});
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
                {...rest} loading={!!$loading}>
            {text ? text : false}
        </Button>
    );
};
const rtRet = (reference, metadata = {}) => {
    const {$loading = false, $op = {}} = reference.state;
    const {text, ...rest} = metadata;
    const fnReset = $op[metadata.id];
    return (
        <Button
            onClick={U.isFunction(fnReset) ? (event) => {
                Ux.formReset(reference);
                fnReset(reference)(event);
            } : () => Ux.formReset(reference)}
            {...rest} loading={$loading}>
            {text ? text : false}
        </Button>
    );
};
const _rtJsx = (reference, $op = {}, show = false) =>
    Object.keys($op).filter(key => !!key).filter(key => U.isFunction($op[key]))
        .map(key => (
            <Button id={key} key={key}
                    onClick={$op[key](reference)}
                    className={show ? "" : "ux-hidden"}/>
        ));
const rtInherit = (reference, show = false) => {
    const {$op = {}} = reference.props;
    return _rtJsx(reference, $op, show);
};
const rtBind = (reference, show = false) => {
    const {$op = {}} = reference.state;
    return _rtJsx(reference, $op, show);
};
const rtDialog = (reference, jsx = {}) => {
    const bind = jsx.bind;
    if (!U.isArray(bind)) return false;
    const processed = [];
    // 字符串格式才执行解析
    bind.forEach(literal => "string" === typeof literal ?
        processed.push(Ai.aiExprOp(literal)) : processed.push(literal));
    return processed.map(item => <Button {...item}
                                         onClick={_rxClick(reference, item)}
                                         className="ux-hidden"/>);
};
const rtNorm = (reference, jsx = {}) => {
    const buttons = jsx.buttons;
    Ux.E.fxTerminal(!buttons.hasOwnProperty("submit"), 10074, "submit");
    // 提交按钮
    const item = Ux.aiExprOp(buttons.submit);
    const reset = buttons.reset ? Ux.aiExprOp(buttons.reset) : false;
    if (!item.id) item.id = item.key;
    if (reset && !reset.id) reset.id = reset.key;
    // 构造配置
    const fnConfig = (type, item) => ({
        type: type,
        key: item.key,
        text: item.text,
        op: item.id,
        id: item.id
    });
    return (
        <span>
            {rtAnt(reference, fnConfig("primary", item))}
            &nbsp;
            {reset ? rtRet(reference, fnConfig("default", reset)) : false}
        </span>
    );
};
const rtPure = (reference, jsx = {}) => {
    const {onClick, text, type = "primary", tips, ...rest} = jsx;
    Ux.E.fxTerminal(!onClick, 10017, onClick);
    let executor = U.isFunction(onClick) ?
        onClick : () => Ux.E.fxTerminal(true, 10017, onClick);
    const fnRender = () => (
        <Button {...rest} onClick={executor} type={type}>
            {text ? text : false}
        </Button>
    );
    const attrs = {};
    if (tips) {
        attrs.key = rest.key;
        if ("string" === typeof tips) {
            attrs.title = tips;
            attrs.placement = "top";
        } else {
            Object.assign(attrs, tips);
        }
    }
    return tips ? (
        <Tooltip {...attrs}>
            {fnRender()}
        </Tooltip>
    ) : fnRender()
};
const rtGroup = (reference, items = [], rest = {}) => {
    return (
        <Button.Group {...rest}>
            {items.map(item => {
                if (!item.hasOwnProperty('key')) {
                    item.key = Ux.randomUUID();
                }
                return rtPure(reference, item);
            })}
        </Button.Group>
    )
};
const rtDirect = (reference, jsx = {}) => {
    if (jsx.hasOwnProperty("direct")) {
        const buttons = Ai.aiExprDirect(jsx.direct, reference.props);
        // 从Op中读取
        const {$op = {}} = reference.state;
        const copied = Ux.clone(buttons);
        copied.forEach(button => {
            if ($op.hasOwnProperty(button.onClick)) {
                // 直接使用metadata节点传入
                const metadata = jsx.metadata ? jsx.metadata : {};
                button.onClick = $op[button.onClick](reference, metadata);
            } else {
                console.error("无法直接渲染", button);
            }
        });
        return (
            <Button.Group>
                {copied.map(button => rtPure(reference, button))}
            </Button.Group>
        );
    } else {
        return false;
    }
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
        <Button
            onClick={() => Ux.toRoute(reference, uri)} {...rest}
            {...attr}>
            {text ? text : false}
        </Button>
    );
};
export default {
    // Pure的另外一种模式
    rtDirect,
    // 分组专用按钮
    rtGroup,
    // 纯按钮
    rtPure,
    // 重置按钮专用
    rtRet,
    // Ant Design标准Form按钮
    rtAnt,
    // React Router按钮
    rtLink,
    // 窗口上的按钮，不带loading效果的纯按钮
    rtDialog,
    // 自定义组件按钮，$op从props中出来，一般来自于父组件，默认隐藏
    rtInherit,
    // 自定义组件按钮，$op从state中出来，一般来源于当前组件的bind方法
    rtBind,
    // 自定义组件按钮，$op从state中出来，一般是：提交、重置，提交为Ant Design的标准按钮
    // 配置文件来源于optionJsx.buttons，并且hidden必须是false默认值（不隐藏的）
    rtNorm,
    // 直接提交函数，封装了防重复提交
    rtSubmit
};