// 导入第三方库
import U from "underscore";
import {v4} from "uuid";
// 导入当前目录
import Parser from "./I.parser.down";
// 导入外层
import Abs from '../../abyss';
import Ut from '../../unity';

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
        item.onClick = () => Ut.connectId(connectId);
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
            delete item['$KV$'];
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
    let $item = Abs.immutable(item);
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
const applyDynamic = (item) => {
    const attrs = {};
    const config = item['$config'] ? item['$config'] : {};
    Object.assign(attrs, config);
    if (config.width && !attrs.style) {
        attrs.style = {
            width: config.width
        };
    }
    // 删除childOnly自定义属性
    if (attrs.hasOwnProperty("childOnly")) delete attrs['childOnly'];
    return attrs;
};
export default {
    applyArray,
    applyKey,
    applyRules,
    applyItem,
    applyStyle,
    applyLoading,
    applyKv,
    applyColumn,
    applyValue,
    applyConnect,
    applyDynamic
};