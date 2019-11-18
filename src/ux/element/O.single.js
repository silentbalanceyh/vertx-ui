import U from "underscore";
import Abs from '../abyss';

const valueInt = (literal = "", dft = 0) => {
    let ret = parseInt(literal, 10);
    if (isNaN(ret)) {
        ret = dft;
    }
    return ret;
};
const valueFloat = (liberal, dft = 0.0) => {
    let ret = parseFloat(liberal);
    if (isNaN(ret)) {
        ret = dft;
    } else {
        ret = ret.toFixed(2);
    }
    ret = parseFloat(ret);
    return ret;
};
const valueUnit = (literal = "") => {
    // 无百分号
    if (literal.endsWith("%")) {
        const item = literal.replace(/%/g, '');
        return valueFloat(item) / 100;
    }
};
const valuePair = (expr) => {
    let mapping;
    if ("string" === typeof expr) {
        mapping = {};
        expr.split(',').filter(kv => 0 < kv.indexOf('='))
            .forEach(kv => {
                const kvArr = kv.split('=');
                if (kvArr[0] && kvArr[1]) {
                    mapping[kvArr[0]] = kvArr[1];
                }
            });
    } else {
        if (expr && U.isObject(expr)) mapping = expr;
        if (!mapping) mapping = {};
    }
    return mapping;
};
const valueFlip = (jsx = {}) => {
    const processed = {};
    const flips = Abs.immutable([
        "fnOut",
        "reference",
        "config"
    ]);
    Object.keys(jsx).filter(key => !flips.contains(key))
        .forEach((field) => processed[field] = jsx[field]);
    return processed;
};
const valueCopy = (target = {}, source = {}, field) => {
    if (field) {
        if ("string" === typeof field) {
            if (source[field]) {
                if (Abs.isObject(source[field])) {
                    target[field] = Abs.clone(source[field]);
                } else if (U.isArray(source[field])) {
                    target[field] = Abs.clone(source[field]);
                } else {
                    target[field] = source[field];
                }
            }
        } else if (U.isArray(field)) {
            field.forEach(eachField => valueCopy(target, source, eachField));
        }
    }
};
export default {
    valueInt,
    valueFloat,
    valueUnit,
    valuePair,
    valueFlip,
    valueCopy,
}