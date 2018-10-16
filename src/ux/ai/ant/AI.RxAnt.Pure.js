import Attributes from "../../prop/Ux.Attribute";
import U from "underscore";
import Aid from './AI.RxAnt.Aid';

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
export default {
    disabledDate,
    prefix,
    placeholder,
    addonAfter,
    multiple,
    onChange,
    onSelect,
};