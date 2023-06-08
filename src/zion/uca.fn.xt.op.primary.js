import __Zn from './zero.module.dependency';
import __V from './uca.__.fn.xt.process';

const Cv = __Zn.Env;

const xtFormat = (internal = [], format) => {
    /* 如果 format 不存在则直接返回 */
    const normalized = __Zn.clone(internal);
    if (format) {
        const formatted = {};
        if ("string" === typeof format) {
            formatted.type = format;
        } else {
            Object.assign(formatted, format);
        }
        /* format 格式化过后 */
        if (Cv.XT_FORMAT.OBJECT === formatted.type
            || Cv.XT_FORMAT.ARRAY_PURE === formatted.type) {
            return normalized;
        } else if (Cv.XT_FORMAT.ARRAY === formatted.type) {
            if ("key" !== formatted.keyField) {
                normalized.forEach(item => {
                    item.key = item[formatted.keyField];
                });
            }
            return normalized;
        } else if (Cv.XT_FORMAT.ARRAY_MAP === formatted.type) {
            const grouped = formatted.keyField ? formatted.keyField : "key";
            const result = {};
            normalized.forEach(item => {
                const key = item[grouped];
                if (key) {
                    const $item = __Zn.clone(item);
                    if ("key" !== grouped) {
                        delete $item.key;
                    }
                    delete $item[grouped];
                    result[key] = $item;
                }
            });
            return result;
        }
    } else return normalized;
}

const xtGet = (reference, field = undefined) => {
    return __V.xtValue(reference, {
        object: (data) => {
            if (data) {
                return field ? data[field] : data;
            } else return data;
        },
        array: (data) => field ? data
            .filter(__Zn.isObject)
            .map(item => item[field]) : data,
        arrayMap: (data) => field ? data
            .filter(__Zn.isObject)
            .map(item => item[field]) : data,
        set: (data) => data ? data : []
    })
};
const xtSet = (reference, name, value) => {
    let field;
    let index = -1;
    if ("string" === typeof name) {
        field = name;
    } else if (__Zn.isArray(name)) {
        field = name[0];
        index = undefined !== name[1] ? name[1] : -1;
    } else if ("number" === typeof name) {
        index = name;
    }
    return __V.xtValue(reference, {
        object: data => {
            if (data) {
                data[field] = value;
            }
            return data;
        },
        array: data => {
            const ref = data[index] ? data[index] : null;
            if (ref) {
                ref[field] = value;
            }
            return data;
        },
        arrayPure: data => {
            data[index] = value;
            return data;
        },
        arrayMap: (data) => {
            data = __Zn.clone(data);
            const objRef = data[index];
            if (objRef) {
                objRef[field] = value;
            }
            return data;
        }
    })
};
const xtUnsafe = (reference, nextProps = {}) => {
    if ('value' in nextProps) {
        const value = nextProps.value;
        reference.setState(value);
    }
};
export default {
    xtGet,
    xtSet,
    xtFormat,
    xtUnsafe,
}