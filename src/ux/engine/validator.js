import T from '../unity';
import Ele from '../element';
import Abs from '../abyss';
import E from '../error';
import Ajax from '../ajax';

import Rx from './expression';
import Datum from './datum';

const _ReadOnly = (id) => T.htmlReadOnly(id);
const _Disabled = (id) => T.htmlDisabled(id);

const _getField = (field, reference, value) => {
    const current = {};
    current.readonly = _ReadOnly(field);
    current.disabled = _Disabled(field);
    current.field = field;
    if (value) {
        current.value = value;
    } else {
        current.value = T.formHit(reference, field);
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
    if (Abs.isArray(rule.condition) && 0 < rule.condition.length) {
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
            const expr = T.formatExpr(cond, params);
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
const isReadyWithCond = (reference, fnCompare = () => true) => (rule = {}, value, callback) => {
    if (isReady(rule, reference, value)) {
        // 处理requiredconfig
        if (value && rule.config) {
            const to = T.formHit(reference, rule.config.to);
            // 如果目标值为 undefined 时,大概率情况为不满足对比的先决条件,直接返回
            if (undefined === to) {
                callback();
            }
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
const isMaximum = (reference, fnCompare = () => true) => (rule = {}, value, callback) => {
    if (isReady(rule, reference, value)) {
        // 处理required
        if (value && rule.config) {
            const to = rule.config.to;
            // 如果目标值为 undefined 时,大概率情况为不满足对比的先决条件,直接返回
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

const _after = (value, to) => {
    const fromValue = Ele.valueTime(value);
    to = Ele.valueTime(to);
    return fromValue.isAfter(to);
};

const _before = (value, to) => {
    const fromValue = Ele.valueTime(value);
    to = Ele.valueTime(to);
    return to.isAfter(fromValue);
};
const _less = (value, to) => value < to;
const _lessOr = (value, to) => value <= to;
const _great = (value, to) => value > to;
const _greatOr = (value, to) => value >= to;
const _equal = (value, to) => value === to;
const _diff = (value, to) => value !== to;
const _maximum = (value, to) => value <= to;
// ---------------------- O.verifiers.js

const required = (reference = {}) => (rule = {}, value, callback) => {
    if (isReady(rule, reference)) {
        if (Abs.isArray(value)) {
            /*
             * Array 类型的，长度必须 > 0
             */
            if (0 < value.length) {
                callback();
            } else {
                callback(rule.message);
            }
        } else {
            // 处理required
            if (value) {
                callback();
            } else {
                callback(rule.message);
            }
        }
    } else {
        callback();
    }
};

const after = (reference = {}) => isReadyWithCond(reference, _after);

const before = (reference = {}) => isReadyWithCond(reference, _before);

const less = (reference = {}) => isReadyWithCond(reference, _less);

const lessOr = (reference = {}) => isReadyWithCond(reference, _lessOr);

const great = (reference = {}) => isReadyWithCond(reference, _great);

const greatOr = (reference = {}) => isReadyWithCond(reference, _greatOr);

const equal = (reference = {}) => isReadyWithCond(reference, _equal);

const diff = (reference = {}) => isReadyWithCond(reference, _diff);

const maximum = (reference = {}) => isMaximum(reference, _maximum);


const range = (isMin = true, isMax = true) => (rule = {}, value, callback) => {
    const {config = {}, message} = rule;
    const number = Number(value);
    if (isNaN(number)) {
        callback("VF: " + message);
    } else {
        const {min, max} = config;
        let minOk = true;
        let maxOk = true;
        // isMin
        if (isMin) {
            if (isNaN(min)) {
                console.warn("CMin: ", message);
                minOk = false;
            } else {
                minOk = (min <= number);
            }
        }
        // isMax
        if (isMax) {
            if (isNaN(max)) {
                console.warn("CMax: ", message);
                maxOk = false;
            } else {
                maxOk = (number <= max);
            }
        }
        if (maxOk && minOk) {
            callback()
        } else {
            callback(message);
        }
    }
}
const min = () => range(true, false);
const max = () => range(false, true);
const currency = () => (rule = {}, value, callback) => {
    const config = {min: 0}
    return range(true, false)({
        ...rule,
        config,
    }, value, callback);
}

const _asyncPre = (reference, jsx, rule, value) => {
    // 有值才验证
    const parameters = Rx.parseAjax(rule.config.params, reference);
    // 基本条件
    const {alias} = rule.config;
    const field = alias && alias.field ? alias.field : rule.field;

    // 让级别条件支持别名，重新抽取字段
    if (
        jsx.hasOwnProperty("precision") ||
        jsx.hasOwnProperty('min') ||
        jsx.hasOwnProperty('max')
    ) {
        if (jsx.precision) {
            parameters[field] = parseFloat(value);
        } else {
            parameters[field] = parseInt(value, 10);
        }
    } else {
        if (Abs.isFunction(jsx.normalize)) {
            parameters[field] = jsx.normalize(value);
        } else {
            parameters[field] = value;
        }
    }
    return parameters;
}
const _asyncBack = (parameters = {}, rule = {}, callback) => {
    // existing 时，参数间关系默认为 AND（更新专用）
    if (Object.keys(parameters).length > 1) {
        const andKey = "";
        parameters[andKey] = true;
    }
    // 远程调用
    Ajax.asyncTrue(rule.config, parameters, {
        // 存在即返回message
        success: () => callback(rule.message),
        failure: () => callback()
    });
}
const existing = (reference = {}, jsx = {}) => (rule = {}, value, callback) => {
    E.fxTerminal(!rule.config, 10022, rule.config);
    if (rule.config) {
        if (value) {
            try {
                // 有值才验证
                const parameters = _asyncPre(reference, jsx, rule, value);

                /*
                 * 关于 key 的计算
                 * 1）$inited 为初始 key
                 * 2）form 中还会包含最新的 key（如果这个过程中会出现变更）
                 */
                {
                    const {$inited} = reference.props;
                    const {alias} = rule.config;
                    const hitField = alias && alias.key ? alias.key : "key";

                    let hitValue = $inited ? $inited[hitField] : undefined;

                    /*
                     * 追加流程，如果 form 的某些操作更改了当前 form 中存在的 key，则需要
                     * 将 hitValue 重新设值成新的 key 而不是旧的
                     */
                    const {form} = reference.props;
                    if (form) {
                        const changed = form.getFieldsValue();
                        if (!!changed[hitField] && hitValue !== changed[hitField]) {
                            hitValue = changed[hitField];
                        }
                    }

                    if (hitValue) {
                        // 更新Mode
                        const updateKey = `key,<>`;
                        parameters[updateKey] = hitValue;
                    }
                }
                _asyncBack(parameters, rule, callback);
            } catch (error) {
                console.error(error);
            }
        } else {
            callback();
        }
    }
};
const uri = (reference = {}, jsx = {}) => (rule = {}, value, callback) => {
    E.fxTerminal(!rule.config, 10022, rule.config);
    if (rule.config) {
        if (value) {
            try {
                // 有值才验证
                const parameters = _asyncPre(reference, jsx, rule, value);

                _asyncBack(parameters, rule, callback);
            } catch (error) {
                console.error(error);
            }
        } else {
            callback();
        }
    }
};

const duplicatedDatum = (reference = {}) => (rule = {}, value, callback) => {
    if (isReady(rule, reference, value)) {
        const {config = {}, field} = rule;
        const {datum = "", keyField = "key"} = config;
        if (datum) {
            /*
             * 从当前表单中读取数据
             */
            const source = Datum.onDatum(reference, datum);
            const key = T.formGet(reference, keyField);
            /*
             * duplicated检查
             * 1. 当前字段已存在
             * 2. 主键必须不同
             */
            const counter = source
                .filter(item => (
                    key !== item[keyField] &&
                    value === item[field]
                )).length;
            if (0 < counter) {
                callback(rule.message);
            } else {
                callback();
            }
        } else {
            callback();
        }
    } else {
        callback();
    }
};
export default {
    // 必填项检查，和Ant Design不同是这里的检查包括一些空值
    required,
    // 时间在目标字段之后
    after,
    // 时间在目标字段之前
    before,
    // < 小于目标字段
    less,
    // <= 小于等于目标字段
    lessOr,
    // > 大于目标字段
    great,
    // >= 大于等于目标字段
    greatOr,
    // == 等于
    equal,
    // 不等检查
    diff,
    // 相同检查
    same: equal,
    /*
     * 返回为 true 的时候，是提示验证信息
     * 返回为 false 的时候，是验证通过
     */
    existing,
    uri,
    /*
     * 特殊规则
     */
    duplicatedDatum,
    // 浮点类型字段整数位最大长度
    maximum,
    // 数值
    min,
    max,
    range,
    currency,
};