import Type from "../Ux.Type";
import E from "../Ux.Error";
import Util from '../util';
import U from 'underscore';
import Value from './Ux.Value.Dust';

const SEARCHERS = {
    // Bool值
    "BOOL": (value) => Boolean(value),
    // 集合值
    "ENUM": (value) => value.split('`'),
    "FIX": (value) => value,
    "OPERATOR": (value) => "AND" === value,
    // 从Tabular/Assist抓取数据
    "DATUM": (value, props) => {
        const source = value[0];
        const filters = {};
        for (let idx = 1; idx < value.length; idx++) {
            const term = value[idx];
            if ("string" === typeof term) {
                const kv = term.split('=');
                filters[kv[0]] = kv[1];
            }
        }
        const unique = Type.elementUniqueDatum({props}, source, filters);
        return unique ? unique.key : undefined;
    },
    "PROP": (value, props) => {
        const path = value[0];
        const attrPath = path.split('.');
        E.fxTerminal(2 !== attrPath.length, 10035, path);
        if (2 === attrPath.length) {
            const targetKey = attrPath[0];
            const dataObj = props[`$${targetKey}`];
            if (dataObj && dataObj.is()) {
                const to = attrPath[1];
                return dataObj._(to);
            }
        }
    },
    "STATE": (value, props, state = {}) => {
        if (value) {
            const {$env = {}} = state;
            if ($env.hasOwnProperty(value)) {
                return $env[value];
            }
        }
    }
};

const valueSearch = (config = {}, props = {}, state = {}) => {
    // 查找根节点
    const result = {};
    Type.itData(config, (field, p, path) => {
        if (SEARCHERS.hasOwnProperty(p)) {
            result[field] = SEARCHERS[p](path[0], props, state);
        } else {
            const propName = `$${p}`;
            if (props[propName]) {
                const dataObject = props[propName];
                const value = dataObject._(path);
                if (value) {
                    result[field] = value;
                } else {
                    console.info(`[ Ux ] 检索节点：${propName}，检索路径：${path}，值：${value}`);
                }
            }
        }
    });
    return result;
};
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
    valueSearch,
    valueTree,
    valueLadder,
    valueDeepCopy
};