import U from "underscore";
import {v4} from "uuid";
import Parser from "./AI.Expr.Parser";
import Op from "../Ux.Op";
import Immutable from "immutable";
import Type from "../Ux.Type";

const applyArray = (literal) => U.isArray(literal) ? literal : literal.replace(/ /g, '').split(',');
const applyKey = (item = {}) => {
    if (!item.hasOwnProperty('key')) {
        item.key = v4();
    }
    return item;
};
const applyRules = (rules = []) => {
    const processed = [];
    rules.forEach(rule => {
        if ("string" === typeof rule) {
            const result = Parser.parseRule(rule);
            if (result) {
                processed.push(result);
            }
        } else {
            processed.push(rule);
        }
    });
    return processed;
};

const applyColumn = (item = {}) => {
    if (item.hasOwnProperty('key')) {
        delete item.key;
    }
    if (item.hasOwnProperty("sorter")) {
        item.sorter = Boolean(item.sorter);
    }
    return item;
};
const applyValue = (item = {}) => {
    if (item.hasOwnProperty("key") && !item.hasOwnProperty("value")) {
        item.value = item.key;
    }
    return item;
};
const applyConnect = (item = {}) => {
    if (item.hasOwnProperty("connectId")) {
        const connectId = item.connectId;
        item.onClick = () => Op.connectId(connectId);
        delete item.connectId;
    }
    return item;
};
const applyLoading = (item = {}, props) => {
    const {$submitting} = props;
    if ($submitting) {
        const submitting = $submitting.is() ? $submitting.to() : {};
        item.loading = submitting.loading;
    }
    return item;
};
const applyKv = (item = {}, config = [], kvs = []) => {
    if (kvs.length >= config.length) {
        if (item.hasOwnProperty("$KV$")) {
            for (let idx = config.length - 1; idx < kvs.length; idx++) {
                const literal = kvs[idx];
                Parser.parseTo(item, literal);
            }
            delete item.$KV$;
        }
    }
    return item;
};
const applyStyle = (item = {}) => {
    if (item.hasOwnProperty('style')) {
        const literal = item.style;
        if ("string" === typeof literal) {
            const styleArr = literal.split(':');
            const style = {};
            style.fontSize = `${styleArr[0]}px`;
            style.color = `${styleArr[1]}`;
            item.style = style;
        }
    }
    return item;
};
const applyItem = (item = {}, config = [], kvs = []) => {
    let $item = Immutable.fromJS(item);
    for (let idx = 0; idx < config.length; idx++) {
        const name = config[idx];
        if (kvs[idx]) {
            if (0 < name.indexOf(".")) {
                $item = $item.setIn(name.split('.'), kvs[idx]);
            } else {
                $item = $item.set(name, kvs[idx]);
            }
        }
    }
    return $item.toJS();
};

const applyFlat = (field, item = {}) => {
    const result = {};
    for (const key in item) {
        const value = item[key];
        const targetKey = `${field}.${key}`;
        if ("object" === typeof value && !U.isArray(value)) {
            const merged = applyFlat(targetKey, value);
            Object.assign(result, merged);
        } else {
            result[targetKey] = value;
        }
    }
    return result;
};
const applyTree = (item = {}) => {
    // 1. 先拉平这个对象
    const processed = {};
    // 过滤$option专用
    Type.itObject(item, (field, value) => {
        if ("object" === typeof value && !U.isArray(value)) {
            const item = applyFlat(field, value);
            Object.assign(processed, item);
        } else {
            processed[field] = value;
        }
    });
    // 2. Key从小到大排序
    let $item = Immutable.fromJS({});
    Object.keys(processed).sort((left, right) => left.length - right.length)
        .forEach(field => {
            if (0 < field.indexOf(".")) {
                $item = $item.setIn(field.split('.'), processed[field])
            } else {
                $item = $item.set(field, processed[field])
            }
        });
    return $item.toJS();
};

export default {
    applyArray,
    applyKey,
    applyRules,
    applyTree,
    applyItem,
    applyStyle,
    applyLoading,
    applyKv,
    applyColumn,
    applyValue,
    applyConnect
}