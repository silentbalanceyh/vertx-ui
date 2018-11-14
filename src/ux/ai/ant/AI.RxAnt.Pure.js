import Attributes from "../../prop/Ux.Attribute";
import U from "underscore";
import Aid from './AI.RxAnt.Aid';
import E from '../../Ux.Error';
import Prop from '../../prop';

const disabledDate = (jsx = {}) => {
    if (jsx.hasOwnProperty('disabledDate')) {
        const attrFun = Attributes[jsx.disabledDate];
        if (U.isFunction(attrFun)) {
            jsx.disabledDate = attrFun;
        }
    }
};
const prefix = (jsx = {}) => {
    if (U.isObject(jsx.prefix)) {
        Aid.applyIcon(jsx, 'prefix');
    }
};
const multiple = (jsx = {}) => {
    if (!jsx.multiple) {
        jsx.multiple = false;
    }
};
const placeholder = (jsx = {}) => {
    if (jsx.readOnly) {
        delete jsx.placeholder;
    }
};
const addonAfter = (jsx = {}) => {
    if (U.isObject(jsx.addonAfter)) {
        Aid.applyIcon(jsx, 'addonAfter');
    }
};
const onChange = (jsx = {}, fnChange) => {
    if (U.isFunction(fnChange)) {
        jsx.onChange = fnChange;
    }
};
const onSelect = (jsx = {}, fnSelect) => {
    if (U.isFunction(fnSelect)) {
        jsx.onSelect = fnSelect;
    }
};
const _readOnlyDepend = (jsx = {}, disabled = false, reference) => {
    // same和diff不能相同
    const readOnly = jsx.readOnly;
    E.fxTerminal(
        // same和diff规则不可同时出现
        readOnly.hasOwnProperty('same') && readOnly.hasOwnProperty('diff')
        , 10101, readOnly.same, readOnly.diff);
    const {same, diff} = readOnly;
    // 读取same和diff的值
    if (same && !diff) {
        // 设置了同规则，readOnly和目标字段相同，即目标字段为true，则readOnly为true
        jsx.readOnly = same ? Prop.formHit(reference, same) : false;
    } else if (!same && diff) {
        // 设置了差异规则，readOnly和目标字段相反，即目标字段为true，则readOnly为false
        jsx.readOnly = !(diff ? Prop.formHit(reference, diff) : false);
    }
    // 设置disabled专用规则
    if (disabled) {
        // Select / Radio 专用
        jsx.disabled = jsx.readOnly;
    }
};
const readOnly = (jsx = {}, disabled = false, reference) => {
    if (jsx.readOnly) {
        if (U.isObject(jsx.readOnly)) {
            // 依赖其他字段
            _readOnlyDepend(jsx, disabled, reference);
        } else {
            // 如果是readOnly，则执行readOnly的注入
            jsx.readOnly = true;
            jsx.disabled = disabled;
        }
    }
};
export default {
    disabledDate,
    prefix,
    placeholder,
    addonAfter,
    multiple,
    readOnly,
    onChange,
    onSelect,
};