import Py from 'js-pinyin';
import __Is from './fn.under.is.decision';
import __A from './fn.atomic.foundation';

// PinYin
Py.setOptions({checkPolyphone: false, charCase: 0})

const valuePinyin = (input) => {
    if ("string" === typeof input) {
        return Py.getFullChars(input);
    } else return input;
}
const valueInt = (literal = "", dft = 0) => {
    let ret = parseInt(literal, 10);
    if (isNaN(ret)) {
        ret = dft;
    }
    return ret;
};
const valueFloat = (literal, dft = 0.0, digest = 2) => {
    let ret = parseFloat(literal);
    if (isNaN(ret)) {
        ret = dft;
    } else {
        ret = ret.toFixed(digest);
    }
    ret = parseFloat(ret);
    return ret;
};
const valueBoolean = (literal) => {
    if ("boolean" === typeof literal) {
        // 布尔值
        return literal;
    } else {
        // 非布尔型
        return "true" === literal;
    }
}
const valueArray = (input) => {
    if (input) {
        if (__Is.isArray(input)) {
            return __A.clone(input);
        } else {
            if (__Is.isObject(input)) {
                if (__Is.isArray(input.list)) {
                    return __A.clone(input.list);
                } else {
                    return [];
                }
            } else {
                return [input];
            }
        }
    } else return [];
}
const valueFactor = (literal = "") => {
    // 无百分号
    if (literal.endsWith("%")) {
        const item = literal.replace(/%/g, '');
        return valueFloat(item) / 100;
    }
};
export default {
    valuePinyin,
    valueInt,
    valueFloat,
    valueBoolean,
    valueArray,
    valueFactor,
}