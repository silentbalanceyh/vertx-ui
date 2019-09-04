import U from "underscore";

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
const valueIcon = (literal = "") => {
    const item = {};
    if (0 < literal.indexOf(",")) {
        const textIcon = literal.replace(/ /g, '').split(',');
        item.text = textIcon[0];
        const iconStr = textIcon[1];
        item.iconStyle = {fontSize: 16};
        if (0 < iconStr.indexOf(":")) {
            const iconStyle = iconStr.split(":");
            item.icon = iconStyle[0];
            item.iconStyle.color = iconStyle[1];
        } else {
            item.icon = iconStr;
        }
    } else {
        item.text = literal;
    }
    return item;
};
export default {
    valueInt,
    valueFloat,
    valueUnit,
    valuePair,
    valueIcon,
}