import U from "underscore";
import Abs from '../abyss';

const valueFlat = (field, item = {}) => {
    const result = {};
    for (const key in item) {
        if (item.hasOwnProperty(key)) {
            const value = item[key];
            const targetKey = `${field}.${key}`;
            if (U.isObject(value) && !U.isArray(value)) {
                const merged = valueFlat(targetKey, value);
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
    Abs.itObject(item, (field, value) => {
        if (U.isObject(value) && !U.isArray(value)) {
            const item = valueFlat(field, value);
            Object.assign(processed, item);
        } else {
            processed[field] = value;
        }
    });
    // 2. Key从小到大排序
    let $item = Abs.immutable({});
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
export default {
    valueLadder,
}