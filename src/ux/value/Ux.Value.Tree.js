import Type from "../Ux.Type";
import Util from '../util';
import U from 'underscore';
import Value from './Ux.Value.Dust';

const valueTree = (array = [], config = {}) => {
    const {
        field = "parentId", // 树专用父节点
        key = "key", // 主键
        zero = true, // children长度为0时是否保留children，默认保留
        sorter = "", // 是否开启排序
    } = config;
    let root = array.filter(U.isObject).filter(each => !each[field]);
    root = Value.clone(root);
    if (sorter) {
        root = root.sort(Util.sorterAscFn(sorter));
    }
    root.forEach(item => {
        item.children = Value.Child.byField(array, {
            item, key, zero, sorter, field
        });
        Value.Child.normalizeData(item, config);
    });
    return root;
};
const _valueDeepConvert = (record, from, to) => {
    if (record.hasOwnProperty(from)) {
        let appended = record[from];
        if (U.isArray(appended)) {
            appended = Value.clone(appended);
            if (record[to] && U.isArray(record[to])) {
                record[to] = record[to].concat(appended);
            } else {
                record[to] = Value.clone(record[from]);
            }
        }
    }
};
const valueDeepCopy = (item = {}, from, to) => {
    Value.element(item, (entity) => {
        // Array和Object统一
        _valueDeepConvert(entity, from, to);
        Type.itObject(entity, (field, value) => {
            if (U.isArray(value)) {
                value.forEach(each => valueDeepCopy(each, from, to));
            } else if (U.isObject(value) && null !== value) {
                valueDeepCopy(value, from, to);
            }
        });
    });
};
const valueFlat = (field, item = {}) => {
    const result = {};
    for (const key in item) {
        const value = item[key];
        const targetKey = `${field}.${key}`;
        if (U.isObject(value) && !U.isArray(value)) {
            const merged = valueFlat(targetKey, value);
            Object.assign(result, merged);
        } else {
            result[targetKey] = value;
        }
    }
    return result;
};
const valueLadder = (item = {}) => {
    // 1. 先拉平这个对象
    const processed = {};
    // 过滤$option专用
    Type.itObject(item, (field, value) => {
        if (U.isObject(value) && !U.isArray(value)) {
            const item = valueFlat(field, value);
            Object.assign(processed, item);
        } else {
            processed[field] = value;
        }
    });
    // 2. Key从小到大排序
    let $item = Value.immutable({});
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
    valueTree,
    valueLadder,
    valueDeepCopy
};