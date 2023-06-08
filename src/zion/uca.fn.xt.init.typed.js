import __Zn from './zero.module.dependency';
import __V from './uca.__.fn.xt.process';

const xtInitObject = (props = {}) => {
    const values = {};
    const value = props.value;
    if (value) {
        values.data = value;
    } else {
        // 默认对象
        values.data = {};
    }
    return values;
};

const xtInitArray = (props = {}, empty = false) => {
    const values = {};
    // 初始化处理
    const value = props.value;
    if (value) {
        // 如果是 String，是否可以直接转换
        let literial = value;
        if ("string" === typeof value) {
            literial = __Zn.wayS2O(value, false);
        } else if (__Zn.isArray(value)) {
            if (0 < value.length) {
                literial = value;
            } else {
                literial = [];
            }
        } else if (value.data && __Zn.isArray(value.data)) {
            if (0 < value.data.length) {
                literial = value.data;
            } else {
                literial = [];
            }
        }
        // Empty 处理
        if (0 === literial.length) {
            if (empty) {
                literial = [];
            } else {
                literial = [{key: __Zn.randomUUID()}];
            }
        }

        if (__Zn.isArray(literial)) {
            values.data = literial;
        }
    } else {
        values.data = ((empty) ? [] : [{key: __Zn.randomUUID()}]);
    }
    return values;
};
const xtInitArrayMap = (props = {}, empty = false) => {
    const values = {};
    // 初始化处理
    const value = props.value;
    if (value) {
        // 构造存在的数组信息
        const normalized = [];
        const {config = {}} = props;
        const {format = {}} = config;
        const {keyField} = format;
        Object.keys(value).forEach(key => {
            const item = __Zn.clone(value[key]);
            if (keyField) {
                item[keyField] = key;
            }
            item.key = __Zn.randomUUID();
            item._key = key;
            normalized.push(item);
        });
        values.data = normalized;
        return values;
    } else return xtInitArray(props, empty);
}
const xtInitFormat = (props = {}) => {
    return __V.xtValue({props}, {
        object: () => xtInitObject(props),
        array: () => xtInitArray(props),
        arrayPure: () => [],
        arrayMap: () => xtInitArrayMap(props),
        arrayGroup: () => ({})
    });
}
export default {
    xtInitObject,
    xtInitArray,
    xtInitArrayMap,
    xtInitFormat,
}