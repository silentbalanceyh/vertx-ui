import __Zn from './zero.module.dependency';

const __fieldReadOnly = (id) => __Zn.htmlReadOnly(id);
const __fieldDisabled = (id) => __Zn.htmlDisabled(id);

const __fieldConfig = (field, reference, value) => {
    const current = {};
    current.readonly = __fieldReadOnly(field);
    current.disabled = __fieldDisabled(field);
    current.field = field;
    if (value) {
        current.value = value;
    } else {
        current.value = __Zn.formHit(reference, field);
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
    if (__Zn.isArray(rule.condition) && 0 < rule.condition.length) {
        /*
         * 当前字段值，和 config.to 中配置的字段
         */
        const value = __fieldConfig(rule.field, reference, currentValue);
        let to = {};
        if (rule.config) {
            to = __fieldConfig(rule.config.to, reference);
        }
        /*
         * 条件检查
         */
        const params = {to, value};
        let checked = true;
        for (let idx = 0; idx < rule.condition.length; idx++) {
            const cond = rule.condition[idx];
            const expr = __Zn.formatExpr(cond, params);
            try {
                // eslint-disable-next-line
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

const isReadyWithCond = (reference, fnCompare = () => true) => (rule = {}, value) => {
    if (isReady(rule, reference, value)) {
        // 处理required config
        if (value && rule.config) {
            const to = __Zn.formHit(reference, rule.config.to);
            // 如果目标值为 undefined 时,大概率情况为不满足对比的先决条件,直接返回
            if (undefined === to) {
                return Promise.resolve();
                // ?allback();
            }
            if (fnCompare(value, to)) {
                return Promise.resolve();
                // ?allback();
            } else {
                return Promise.reject(rule.message);
                // ?allback(rule.message);
            }
        } else {
            return Promise.resolve();
            // ?allback();
        }
    } else {
        return Promise.resolve();
        // ?allback();
    }
};
const isMaximum = (reference, fnCompare = () => true) => (rule = {}, value) => {
    if (isReady(rule, reference, value)) {
        // 处理required
        if (value && rule.config) {
            const to = rule.config.to;
            // 如果目标值为 undefined 时,大概率情况为不满足对比的先决条件,直接返回
            if (fnCompare(value, to)) {
                return Promise.resolve();
                // ?allback();
            } else {
                return Promise.reject(rule.message);
                // ?allback(rule.message);
            }
        } else {
            return Promise.resolve();
            // ?allback();
        }
    } else {
        return Promise.resolve();
        // ?allback();
    }
};
export default {
    isReady,
    isReadyWithCond,
    isMaximum,
}