import U from 'underscore';
import E from '../error';
import V from './O.immutable';
import Is from './O.is';

const itMatrix = (matrix = [], eachFun) => {
    matrix.forEach(row => {
        if (U.isArray(row)) {
            row.forEach(item => eachFun(item));
        } else {
            eachFun(row);
        }
    });
    return matrix;
};
const itObject = (data = {}, executor = () => {
}, invalid = false) => {
    const iterator = V.clone(data);
    // eslint-disable-next-line
    for (const key in iterator) {
        if (iterator.hasOwnProperty(key) &&
            data.hasOwnProperty(key)) {
            const value = data[key];
            if (invalid) {
                executor(key, value);
            } else {
                /*
                 * false / null / 0 都属于业务边界值
                 */
                if (undefined !== value) {
                    executor(key, value);
                }
            }
        }
    }
};
const itUi = (ui = [], eachFun, itemFun = item => item) => {
    ui.forEach((row, rowIndex) => {
        if (U.isArray(row)) {
            row.forEach((cell, cellIndex) => {
                if ("string" === typeof cell) {
                    row[cellIndex] = eachFun(cell);
                } else if (U.isObject(cell)) {
                    row[cellIndex] = itemFun(cell);
                }
            });
        } else {
            ui[rowIndex] = eachFun(row);
        }
    });
    return ui;
};
const itRow = (row) => {
    if (Array.prototype.isPrototypeOf(row)) {
        return row;
    } else {
        return row.items ? row.items : [];
    }
};
const itElement = (data = [], field = "", itemFun = () => {
}) => {
    E.fxTerminal(!U.isArray(data), 10071, data, "Array");
    E.fxTerminal(!U.isFunction(itemFun), 10071, itemFun, "Function");
    data.forEach(item => {
        if (item && item[field]) {
            item[field] = itemFun(item[field], item);
        }
    });
};
const itFull = (data = [], items = {}, fieldFun = () => {
}) => {
    E.fxTerminal(!U.isArray(data), 10071, data, "Array");
    E.fxTerminal(!U.isFunction(fieldFun), 10071, fieldFun, "Function");
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

/*
 * 迭代的几种：
 * 1. 迭代 Array 中的每一个元素
 * 2. 迭代 Object 中的每一个 key = value 中的 value
 * 3. 自身迭代没有任何意义
 */
const itValue = (object = {}, transformer, key) => {
    if (U.isFunction(transformer) && Is.isObject(object)) {
        Object.keys(object).forEach(field => {
            const valueRef = object[field];
            if (U.isObject(valueRef)) {
                const processed = transformer(valueRef);
                if (processed) {
                    if (key) {
                        if (valueRef.hasOwnProperty(key)) {
                            Object.assign(valueRef[key], processed)
                        } else {
                            valueRef[key] = processed;
                        }
                    } else {
                        if (Is.isObject(processed)) {
                            Object.assign(valueRef, processed);
                        }
                    }
                }
            }
        });
    }
};
const itTree = (treeArray = [], executor) => {
    if (U.isFunction(executor)) {
        treeArray.forEach(item => {
            executor(item);
            if (item.children && 0 < item.children.length) {
                itTree(item.children, executor);
            }
        })
    }
};
export default {
    itMatrix,
    itObject,
    itValue,
    itUi,
    itRow,
    itFull,
    itElement,
    itTree,
}