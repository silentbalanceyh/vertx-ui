import Prop from "../prop/Ux.Form";
import UI from "../util/Ux.Html";
import Expr from '../util/Ux.Expr';
import U from 'underscore';

const _ReadOnly = (id) => UI.htmlReadOnly(id);
const _Disabled = (id) => UI.htmlDisabled(id);

const _getField = (field, reference, value) => {
    const current = {};
    current.readonly = _ReadOnly(field);
    current.disabled = _Disabled(field);
    current.field = field;
    if (value) {
        current.value = value;
    } else {
        current.value = Prop.formHit(reference, field);
    }
    if ("string" === typeof current.value) {
        current.length = current.value.length;
    }
    return current;
};

const isReady = (rule = {}, reference, currentValue) => {
    // 是否检查readonly和disabled
    let ready = true;
    /*
     * rule 配置中包含了 condition 节点才会执行检查
     * {
     *     "condition":[
     *     ]
     * }
     */
    if (U.isArray(rule.condition) && 0 < rule.condition.length) {
        /*
         * 当前字段值，和 config.to 中配置的字段
         */
        const value = _getField(rule.field, reference, currentValue);
        let to = {};
        if (rule.config) {
            to = _getField(rule.config.to, reference);
        }
        /*
         * 条件检查
         */
        const params = {to, value};
        let checked = true;
        for (let idx = 0; idx < rule.condition.length; idx++) {
            const cond = rule.condition[idx];
            const expr = Expr.formatExpr(cond, params);
            try {
                checked = eval(expr);
            } catch (e) {
                console.error(e);
            }
            if (!checked) {
                break;
            }
        }
        /* */
        ready = checked;
    }
    return ready;
};
const isReadyWithCond = (reference, fnCompare = () => true) => (rule = {}, value, callback) => {
    if (isReady(rule, reference, value)) {
        // 处理required
        if (value && rule.config) {
            const to = Prop.formHit(reference, rule.config.to);
            if (fnCompare(value, to)) {
                callback();
            } else {
                callback(rule.message);
            }
        } else {
            callback();
        }
    } else {
        callback();
    }
};
export default {
    isReady,
    isReadyWithCond
}