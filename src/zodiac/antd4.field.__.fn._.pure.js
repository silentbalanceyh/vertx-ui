import __DISABLED_DATE from './antd4.field.__.fn.prop.disabled.date';
import __V4 from './antd4.fn.v4.patch';
import __FORM from './form.fn.form.action';
import __Zn from './zero.module.dependency';

const __applyIcon = (jsx, key = "") => {
    const {type, ...rest} = jsx[key];
    jsx[key] = __V4.v4Icon(type, rest);
};
const disabledDate = (jsx = {}) => {
    if (jsx.hasOwnProperty('disabledDate')) {
        const attrFun = __DISABLED_DATE[jsx.disabledDate];
        if (__Zn.isFunction(attrFun)) {
            jsx.disabledDate = attrFun;
        }
    }
};
const prefix = (jsx = {}) => {
    if (__Zn.isObject(jsx.prefix)) {
        __applyIcon(jsx, 'prefix');
    }
};
const multiple = (jsx = {}) => {
    if (!jsx.multiple) {
        jsx.multiple = false;
    }
};
const placeholder = (jsx = {}) => {
    /*
     * 双开处理 placeholder
     * disabled / readOnly 都为 true 的时候，直接删除
     * placeholder，这种情况下只能依赖 inscribe 来处理文字呈现
     */
    if (jsx.readOnly || jsx.disabled) {
        delete jsx.placeholder;
    }
    if (jsx.inscribe) {
        jsx.placeholder = jsx.inscribe;
        // 如果配置了 inscribe，配置新的class
        __Zn.toCssClass(jsx, "ux_inscribe")
    }
};
const addonAfter = (jsx = {}) => {
    if (__Zn.isObject(jsx.addonAfter)) {
        __applyIcon(jsx, 'addonAfter');
    }
};

const readOnly = (jsx = {}, disabled = false, reference) => {
    if (jsx.readOnly) {
        if (__Zn.isObject(jsx.readOnly)) {
            // 依赖其他字段
            // same和diff不能相同
            const readOnly = jsx.readOnly;
            __Zn.fxTerminal(
                // same和diff规则不可同时出现
                readOnly.hasOwnProperty('same') && readOnly.hasOwnProperty('diff')
                , 10101, readOnly.same, readOnly.diff);
            const {same, diff} = readOnly;
            // 读取same和diff的值
            if (same && !diff) {
                // 设置了同规则，readOnly和目标字段相同，即目标字段为true，则readOnly为true
                jsx.readOnly = same ? __FORM.formHit(reference, same) : false;
            } else if (!same && diff) {
                // 设置了差异规则，readOnly和目标字段相反，即目标字段为true，则readOnly为false
                jsx.readOnly = !(diff ? __FORM.formHit(reference, diff) : false);
            }
            // 设置disabled专用规则
            if (disabled) {
                // Select / Radio 专用
                jsx.disabled = jsx.readOnly;
            }
        } else {
            // 如果是readOnly，则执行readOnly的注入
            jsx.readOnly = true;
            if ("multiple" !== jsx.mode) {
                /*
                 * 多选不禁用
                 * 单选禁用
                 */
                jsx.disabled = disabled;
            }
        }
    }
};
const reduce = (jsx = {}, reference) => {
    const {rxReduce} = reference.props;
    if (rxReduce) {
        jsx.rxReduce = rxReduce;
    }
}
export default {
    disabledDate,
    prefix,
    placeholder,
    addonAfter,
    multiple,
    readOnly,
    reduce,
};