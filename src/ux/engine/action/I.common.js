import Expr from "../expression";
import EVENT from "./event";
import Abs from '../../abyss';
import Dev from '../../develop';
import U from 'underscore';

const exprReset = (reference, expr = "") => {
    const reset = Expr.aiExprOp(expr);
    reset.type = "default";
    reset.event = "RESET";
    reset.onClick = EVENT[reset.event](reference, reset);
    Object.freeze(reset);
    return reset;
};
const exprSubmit = (reference, expr = "") => {
    const item = Expr.aiExprOp(expr);
    item.type = "primary";
    item.event = "SUBMIT";
    item.onClick = EVENT[item.event](reference, item);
    Object.freeze(item);
    return item;
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
                config,
                $op,
            }, "[ Ux ] 未捕捉到对应配置", "#CDAD00");
        }
        return Abs.promise(() => false);
    }
};
const exprUniform = (reference, expr = "") => {
    const item = Expr.aiExprOp(expr);
    item.onClick = EVENT[item.event](reference, item);
    Object.freeze(item);
    return item;
};
export default {
    exprReset,
    exprSubmit,
    exprUniform,
    performFn,
}