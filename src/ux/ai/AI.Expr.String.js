import Op from '../Ux.Op';
import Type from '../Ux.Type';
import Value from '../Ux.Value';
import U from 'underscore';
import Immutable from 'immutable';
import Parser from './AI.Expr.Parser';
import ExprData from './AI.Expr';
import {v4} from 'uuid';

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
const applyField = (item = {}) => {
    if (item.hasOwnProperty('key')) {
        delete item.key;
    }
    if (item.span) {
        item.span = Value.valueInt(item.span);
    }
    if (item.optionConfig && item.optionConfig.rules) {
        item.optionConfig.rules = applyRules(item.optionConfig.rules);
    }
    if (0 < item.field.indexOf('`')) {
        // Filter专用语法解析
        item.field = item.field.replace('`', ',');
    }
    // 解析ajax属性，ListSelector专用
    const ajaxConfig = item.optionJsx && item.optionJsx.config ? item.optionJsx.config : {};
    if (ajaxConfig && ajaxConfig.hasOwnProperty("ajax")) {
        ajaxConfig.ajax = aiExprAjax(ajaxConfig.ajax);
    }
    return item;
};

const aiMetaColumn = (item = {}) => {
    if (item.metadata) {
        const {metadata, ...rest} = item;
        const basic = parseItem(metadata, "column");
        const options = applyTree(rest);
        Object.assign(basic, options);
        applyColumn(basic);
        item = basic;
    }
    return item;
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
    const submitting = $submitting.is() ? $submitting.to() : {};
    item.laoding = submitting.loading;
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
const applyTree = (item = {}) => {
    let $item = Immutable.fromJS({});
    Type.itObject(item, (field, value) => {
        if (0 < field.indexOf(".")) {
            $item = $item.setIn(field.split('.'), value);
        } else {
            $item = $item.set(field, value);
        }
    });
    return $item.toJS();
};
const parseItem = (kvs = [], key) => {
    let item = {};
    if ("string" === typeof kvs || U.isArray(kvs)) {
        kvs = applyArray(kvs);
        if (ExprData[key]) {
            const config = ExprData[key];
            // 基本属性解析
            item = applyItem(item, config, kvs);
            // 补上key（无key的时候处理）
            applyKey(item);
            // 检查connectId：Button专用，其他的不影响
            applyConnect(item);
            // style计算，所有组件通用
            applyStyle(item);
            // 额外的键值对
            applyKv(item, config, kvs);
        }
    } else {
        item = Immutable.fromJS(kvs).toJS();
    }
    return item;
};
const _iterator = (array = [], callback, objectCallback = data => data) => {
    const items = [];
    array.forEach(each => {
        if ("string" === typeof each) {
            each = each.replace(/ /g, '');
            const item = callback(each.split(','));
            items.push(item);
        } else {
            items.push(objectCallback(each));
        }
    });
    return items;
};
const aiExprTitle = (item) => {
    // title专用解析器
    if ("string" === typeof item && 0 <= item.indexOf("title")) {
        const kv = item.split("=");
        const result = {};
        // Ant-Design Form必须
        result.field = v4();
        result[kv[0]] = kv[1];
        item = result;
    }
    return item;
};
const aiExprInit = (item = {}, values = {}) => {
    // 初始化optionConfig
    if (!item.optionConfig) {
        item.optionConfig = {};
    }
    if (values.hasOwnProperty(item.field)) {
        item.optionConfig.initialValue = values[item.field];
    }
    return item;
};
/**
 * 顺序：field, optionItem.label, span, optionJsx.style.width, render, $KV$
 */
const aiExprField = (literal = "") => applyField(parseItem(literal, "field"));
/**
 * 如果是Object：只有metadata，然后包含各种options
 */
const aiMetaField = (item = {}) => {
    if (item.metadata) {
        const {metadata, ...rest} = item;
        const basic = parseItem(metadata, "field");
        const options = applyTree(rest);
        Object.assign(basic, options);
        applyField(basic);
        item = basic;
    }
    return item;
};

const aiExprWindow = (literal = "") => {
    const item = parseItem(literal, "window");
    if (item.hasOwnProperty('key')) {
        delete item['key']
    }
    if (item.hasOwnProperty('visible')) item.visible = Boolean(item.visible);
    if (item.hasOwnProperty('maskClosable')) item.visible = Boolean(item.visible);
    if (item.hasOwnProperty('width')) item.width = Value.valueInt(item.width);
    return item;
};

const aiExprAjax = (ajax = {}) => {
    // 默认是POST方法
    let item = ajax;
    const {metadata, ...rest} = ajax;
    if (metadata) {
        // 如果是对象，出现了metadata才会执行属性解析
        item = parseItem(metadata, "ajax");
        // 分页参数执行整数
        const pager = item.params.pager;
        if (pager) {
            pager.page = Value.valueInt(pager.page);
            pager.size = Value.valueInt(pager.size);
        }
        const lefts = applyTree(rest);
        // 只合并criteria
        item.params.criteria = lefts.params.criteria;
    }
    return item;
};
/**
 * 顺序：name, icon, style
 */
const aiExpr = (literal = "") => parseItem(literal, "flag");
/**
 * 顺序：dataIndex, title, $render, sorter
 */
const aiExprColumn = (columns = []) =>
    _iterator(columns, (values = []) => applyColumn(parseItem(values, "column")),
        aiMetaColumn);
/**
 * 顺序：key, label, style
 */
const aiExprOption = (options = []) =>
    _iterator(options, (values = []) => parseItem(values, "option"), aiMetaOption).map(applyValue);

const aiMetaOption = (item = {}) => {
    if (item.metadata) {
        let each = parseItem(item.metadata, "option");
        if (item.items) {
            each.items = aiExprOption(item.items);
        }
        item = each;
    }
    return item;
};
/**
 * 顺序：title, key, icon, description, status
 */
const aiExprHelp = (steps = []) =>
    _iterator(applyArray(steps), (values = []) => parseItem(values, "steps"))
        .map(applyKey);
/**
 * 顺序：key, text, connectId, type, icon
 */
const aiExprButton = (buttons = [], props = {}) =>
    _iterator(buttons, (values = []) => parseItem(values, "button"))
        .map(applyConnect).map(item => applyLoading(item, props));
export default {
    aiExprHelp,
    aiExpr,
    aiExprColumn,
    aiExprOption,
    aiExprButton,
    aiExprField,
    aiExprWindow,
    aiExprAjax,
    // 对象解析
    aiMetaOption,
    aiMetaColumn,
    aiMetaField,
    // 特殊解析
    aiExprTitle,
    aiExprInit
}