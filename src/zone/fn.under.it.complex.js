// 禁止：import __A from './fn.atomic.foundation';
import __Is from './fn.under.is.decision';
import E from './fn.debug.fx.error';

const itMatrix = (matrix = [], eachFun) => {
    matrix.forEach(row => {
        if (__Is.isArray(row)) {
            row.forEach(item => eachFun(item));
        } else {
            eachFun(row);
        }
    });
    return matrix;
};
const itRow = (row) => {
    if (__Is.isArray(row)) {
        return row;
    } else {
        return __Is.isArray(row['items']) ? row['items'] : [];
    }
};
const itFull = (data = [], items = {}, fieldFun = () => {
}) => {
    E.fxTerminal(!__Is.isArray(data), 10071, data, "Array");
    E.fxTerminal(!__Is.isFunction(fieldFun), 10071, fieldFun, "Function");
    data.filter(item => !!item).forEach(item => {
        // eslint-disable-next-line
        for (const key in items) {
            if (items.hasOwnProperty(key)) {
                // item中的值处理
                const value = items[key];
                if (key && value) {
                    // Object -> item
                    // String -> key
                    // Unknown -> value
                    fieldFun(item, key, value);
                }
            }
        }
    });
};
const itValue = (object = {}, transformer, key) => {
    if (__Is.isFunction(transformer) && __Is.isObject(object)) {
        Object.keys(object).forEach(field => {
            const valueRef = object[field];
            if (__Is.isObject(valueRef)) {
                const processed = transformer(valueRef);
                if (processed) {
                    if (key) {
                        if (valueRef.hasOwnProperty(key)) {
                            Object.assign(valueRef[key], processed)
                        } else {
                            valueRef[key] = processed;
                        }
                    } else {
                        if (__Is.isObject(processed)) {
                            Object.assign(valueRef, processed);
                        }
                    }
                }
            }
        });
    }
};
export default {
    itMatrix,
    itRow, itItems: itRow,
    itFull,
    itValue,
}