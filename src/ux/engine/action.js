import T from "../unity";
import E from '../error';
import Abs from "../abyss";
import Ajax from "../ajax";
import Dev from '../develop';
// Engine 内部
import Expr from "./expression";

const _submit = (reference, config, redux = false) => {
    // $loading设置
    reference.setState({$loading: true});
    return T.formSubmit(reference, redux)
        /* Performer */
        .then(data => performFn(reference, config)
            /* 记得拷贝数据传入 perform，否则 data 无法被扩展 */
            .then(perform => perform(data))
        )
};
const RESET = (reference, config = {}) => (event) => {
    Abs.prevent(event);
    T.formReset(reference);
    performFn(reference, config)
        /* 执行函数 */
        .then(perform => perform(event));
};
const SUBMIT = (reference, config = {}) => (event) => {
    Abs.prevent(event);
    return _submit(reference, config)
        /* 统一 Error 处理 */
        .catch(error => Ajax.ajaxError(reference, error))
};
/*
 * 比 SUBMIT 多一层 redux 的提交
 */
const SUBMIT_REDUX = (reference, config = {}) => (event) => {
    Abs.prevent(event);
    // $loading设置
    T.writeSubmit(reference);

    return _submit(reference, config, true)
        /* 统一 Error 处理 */
        .catch(error => Ajax.ajaxError(reference, error, true))
};
const SUBMIT_DIALOG = (reference, config = {}) => (event) => {
    Abs.prevent(event);
    // 外置的 $submitting = true
    const {doSubmitting} = reference.props;
    if (Abs.isFunction(doSubmitting)) {
        doSubmitting();
    }
    return _submit(reference, config)
        .catch(error => Ajax.ajaxError(reference, error))
};
const KEY = (reference, config = {}) => (event) => {
    Abs.prevent(event);
    // $loading设置
    reference.setState({$loading: true});
    return T.formSubmit(reference)
        /* Performer */
        .then(data => Abs.promise({key: data.key}))
        /* */
        .then(data => performFn(reference, config)
            /* 记得拷贝数据传入 perform，否则 data 无法被扩展 */
            .then(perform => perform(data))
        )
        /* 统一 Error 处理 */
        .catch(error => Ajax.ajaxError(reference, error))
};

const SAVE_ROW = (reference, config = {}) => (event) => {
    Abs.prevent(event);
    // 外置的 $submitting = true
    const {doSubmitting} = reference.props;
    if (Abs.isFunction(doSubmitting)) {
        doSubmitting();
    }
    return T.formSubmit(reference)
        .then(data => performFn(reference, config)
            .then(perform => perform(data)))
        .catch(error => Ajax.ajaxError(reference, error))
};
const EVENT = {
    RESET,          // 重置（Ant Design专用）
    SUBMIT,         // （Ajax）标准提交
    SUBMIT_REDUX,   // （Ajax）表单提交（带Redux）
    SUBMIT_DIALOG,  // （Ajax）弹框表单提交
    KEY,            // （Ajax）删除专用
    SAVE_ROW,       // 子表单提交（客户端保存）
}

const mountEvent = (config = {}, reference, eventName = 'onClick') => {
    const eventFun = EVENT[config.event];
    if (Abs.isFunction(eventFun)) {
        const onEvent = eventFun(reference, config);
        /*
         * 权限限制处理，后期引入表单级别的权限控制
         */
        if (Abs.isFunction(onEvent)) {
            config[eventName] = onEvent;
        } else {
            config[eventName] = () =>
                console.error(`[ Ux ] 找到的事件 key = ${config.event} 不是一个高阶函数，无法生成最终事件`);
        }
    } else {
        config[eventName] = () =>
            console.error(`[ Ux ] 无法找到对应的事件信息，key = ${config.event}`, EVENT);
    }
};
/*
 * 执行 $op 中的函数相关信息
 */
const performFn = (reference, config = {}) => {
    const {$op = {}} = reference.state ? reference.state : {};
    const performer = $op[config.key];
    if (Abs.isFunction(performer)) {
        return Abs.promise(performer(reference, config));
    } else {
        /* 空函数，防止 then 之后无法调用 */
        if ("RESET" !== config.event) {
            Dev.dgDebug({
                event: config.event,
                config,
                $op,
            }, "[ Ux ] 未捕捉到对应配置", "red");
        }
        return Abs.promise(() => false);
    }
};
const exprReset = (reference, expr = "") => {
    const reset = Expr.aiExprOp(expr);
    reset.type = "default";
    reset.event = "RESET";
    mountEvent(reset, reference);
    Object.freeze(reset);
    return reset;
};
const exprSubmit = (reference, expr = "") => {
    const item = Expr.aiExprOp(expr);
    item.type = "primary";
    item.event = "SUBMIT";
    mountEvent(item, reference);
    Object.freeze(item);
    return item;
};
const exprUniform = (reference, expr = "") => {
    const item = Expr.aiExprOp(expr);
    mountEvent(item, reference);
    Object.freeze(item);
    return item;
};
const _raftButtons = (reference, jsx) => {
    const buttons = jsx.buttons;
    E.fxTerminal(!buttons.hasOwnProperty('submit'), 10074, 'submit');
    const normalized = [];
    // 提交按钮解析
    const item = exprSubmit(reference, buttons.submit);
    normalized.push(item);
    if (buttons.reset) {
        // 重置按钮属性
        const reset = exprReset(reference, buttons.reset);
        normalized.push(reset);
    }
    return normalized;
};
const _raftExtensions = (reference, jsx) => {
    const extension = jsx.extension;
    const normalized = [];
    if (Abs.isArray(extension)) {
        extension.map(each => exprUniform(reference, each))
            .filter(each => undefined !== each)
            .forEach(each => normalized.push(each));
    }
    return normalized;
};
const raftAction = (cell = {}, reference) => {
    /*
     * 显示隐藏的基本处理
     */
    if (!cell.optionJsx) cell.optionJsx = {};
    cell.optionJsx.hidden = !!cell.hidden;
    /*
     * 进行分流解析
     */
    const jsxRef = cell.optionJsx;
    if (jsxRef.buttons) {
        // submit + reset 双按钮
        jsxRef.actions = _raftButtons(reference, jsxRef);
    } else if (jsxRef.extension) {
        /*
         * extension 多按钮模式，新模式
         * 带权限控制
         */
        jsxRef.actions = _raftExtensions(reference, jsxRef);
    } else {
        // 非法
        console.error(cell);
        throw new Error("无法渲染的按钮！")
    }
};
export default {
    raftAction,
}