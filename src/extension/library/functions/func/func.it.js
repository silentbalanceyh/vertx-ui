import U from 'underscore';
import Ux from 'ux';

const itValue = (object = {}, transformer, key) => {
    if (U.isFunction(transformer) && Ux.isObject(object)) {
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
                        if (Ux.isObject(processed)) {
                            Object.assign(valueRef, processed);
                        }
                    }
                }
            }
        });
    }
};
/*
 * 迭代的几种：
 * 1. 迭代 Array 中的每一个元素
 * 2. 迭代 Object 中的每一个 key = value 中的 value
 * 3. 自身迭代没有任何意义
 */
export default {
    itValue,
}