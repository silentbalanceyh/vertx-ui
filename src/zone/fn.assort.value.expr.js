import __Is from './fn.under.is.decision';
import __It from './fn.under.it.spread';
import __A from './fn.atomic.foundation';
import __Fmt from './fn.unity.format';

const __valueFlat = (field, item = {}) => {
    const result = {};
    // eslint-disable-next-line
    for (const key in item) {
        if (item.hasOwnProperty(key)) {
            const value = item[key];
            const targetKey = `${field}.${key}`;
            if (__Is.isObject(value) && !__Is.isArray(value)) {
                const merged = __valueFlat(targetKey, value);
                Object.assign(result, merged);
            } else {
                result[targetKey] = value;
            }
        }
    }
    return result;
};
const valueLadder = (item = {}) => {
    // 1. 先拉平这个对象
    const processed = {};
    // 过滤$option专用
    __It.itObject(item, (field, value) => {
        if (__Is.isObject(value) && !__Is.isArray(value)) {
            const item = __valueFlat(field, value);
            Object.assign(processed, item);
        } else {
            processed[field] = value;
        }
    });
    // 2. Key从小到大排序
    let $item = __A.immutable({});
    Object.keys(processed).sort((left, right) => left.length - right.length)
        .forEach(field => {
            if (0 < field.indexOf(".")) {
                $item = $item.setIn(field.split('.'), processed[field]);
            } else {
                $item = $item.set(field, processed[field]);
            }
        });
    return $item.toJS();
};
const valueExpr = (expr = "", data = {}, keep = false) => {
    let display;
    if (0 <= expr.indexOf(":")) {
        display = __Fmt.formatExpr(expr, data, keep);
    } else {
        display = data[expr];
        if (!display) display = "";
    }
    return display;
};
const valueParse = (valueOrExpr) => {
    const firstIndex = valueOrExpr.indexOf(":");
    const parsed = {};
    parsed.type = valueOrExpr.substring(0, firstIndex);
    parsed.expression = valueOrExpr.substring(firstIndex + 1, valueOrExpr.length);
    return parsed;
}
const valuePair = (expr) => {
    let mapping;
    if ("string" === typeof expr) {
        mapping = {};
        expr.split(',').filter(kv => 0 < kv.indexOf('=')).forEach(kv => {
            const kvArr = kv.split('=');
            if (kvArr[0] && kvArr[1]) {
                mapping[kvArr[0]] = kvArr[1];
            }
        });
    } else {
        if (expr && __Is.isObject(expr)) mapping = expr;
        if (!mapping) mapping = {};
    }
    return mapping;
};

const valuePath = (data = {}, path) => {
    if ("string" !== typeof path) {
        console.error(data, path);
        throw new Error("[ Ux ] valuePath 要求第二个参数必须是 String 类型");
    }
    if (path.indexOf('.')) {
        const $data = __A.immutable(data);
        const fullPath = path.split('.');
        const calculated = $data.getIn(fullPath);
        if (calculated) {
            /*
             * 拿到对象信息
             */
            if (__Is.isFunction(calculated.toJS)) {
                const value = calculated.toJS();
                if (undefined === value) {
                    return null;
                } else {
                    return value;
                }
            } else {
                return calculated;
            }
        } else {
            /*
             * 搜索到的值是undefined
             */
            return null;
        }
    } else {
        /*
         * 读取不带表达式字段的值
         */
        const value = data[path];
        if (undefined === value) {
            return null;
        } else {
            return value;
        }
    }
};
const valueSubset = (input = {}, ...fields) => {
    if (__Is.isObject(input)) {
        const required = {};
        fields.forEach(fieldArg => {
            if (__Is.isArray(fieldArg)) {
                fieldArg.forEach(field => {
                    if (undefined !== input[field]) {
                        required[field] = input[field];
                    }
                });
            } else {
                if (undefined !== input[fieldArg]) {
                    required[fieldArg] = input[fieldArg];
                }
            }
        });
        return required;
    } else if (__Is.isArray(input)) {
        const required = [];
        input.forEach(element => {
            required.push(valueSubset(element, fields));
        });
        return required;
    }
}
export default {
    valueLadder,
    valueExpr,
    valueParse,
    valuePair,
    valuePath,
    valueSubset,
}