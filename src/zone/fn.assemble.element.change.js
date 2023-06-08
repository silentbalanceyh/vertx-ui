import __QR from './fn.assemble.element.qr';
import __Is from './fn.under.is.decision';
import __A from './fn.atomic.foundation';

const elementSave = (data = [], item, idField = "key") => {
    if (__Is.isArray(data)) {
        if (__Is.isArray(item)) {
            // Array Save Array
            item.forEach(record => elementSave(data, record, idField));
        } else {
            // 元素信息处理
            const found = __QR.elementUnique(data, idField, item[idField]);
            if (found) {
                Object.assign(found, item);
            } else {
                data.push(item);
            }
        }
    }
    return data;
}
const elementOrder = (data = [], keys = [], keyField = "key") => {
    const ordered = [];
    keys.forEach(key => {
        const found = __QR.elementUnique(data, keyField, key);
        if (found) {
            ordered.push(found);
        }
    });
    return __A.clone(ordered);
}
const elementDown = (array = [], value, field) => {
    const result = __A.clone(array);
    const index1 = __QR.elementIndex(array, value, field);
    const index2 = index1 + 1;
    result[index1] = result.splice(index2, 1, result[index1])[0];
    return result;
}
const elementUp = (array = [], value, field) => {
    const result = __A.clone(array);
    const index2 = __QR.elementIndex(array, value, field);
    const index1 = index2 - 1;
    result[index1] = result.splice(index2, 1, result[index1])[0];
    return result;
}
export default {
    elementSave,
    elementOrder,
    elementUp,
    elementDown,
}