import Expr from "../expression";
import EVENT from "./event";
import Abs from '../../abyss';
import Dev from '../../develop';
import U from 'underscore';

const mountEvent = (config = {}, reference, eventName = 'onClick') => {
    const eventFun = EVENT[config.event];
    if (U.isFunction(eventFun)) {
        const onEvent = eventFun(reference, config);
        if (U.isFunction(onEvent)) {
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
    if (U.isFunction(performer)) {
        return Abs.promise(performer(reference));
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
export default {
    exprReset,
    exprSubmit,
    exprUniform,
    performFn,
}