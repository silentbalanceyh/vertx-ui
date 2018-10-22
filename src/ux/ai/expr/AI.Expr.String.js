import U from 'underscore';
import ExprData from './AI.Expr';
import ExprValue from './AI.Expr.Value';
import Value from '../../Ux.Value';
import {v4} from 'uuid';

const parseItem = (kvs = [], key) => {
    let item = {};
    if ("string" === typeof kvs || U.isArray(kvs)) {
        kvs = ExprValue.applyArray(kvs);
        if (ExprData[key]) {
            const config = ExprData[key];
            // 基本属性解析
            item = ExprValue.applyItem(item, config, kvs);
            // 补上key（无key的时候处理）
            ExprValue.applyKey(item);
            // 检查connectId：Button专用，其他的不影响
            ExprValue.applyConnect(item);
            // style计算，所有组件通用
            ExprValue.applyStyle(item);
            // 额外的键值对
            ExprValue.applyKv(item, config, kvs);
        }
    } else {
        item = Value.clone(kvs);
    }
    return item;
};
const parseAction = (jsx = {}) => {
    ["bind"].forEach(field => {
        if (jsx[field]) {
            const binds = U.isArray(jsx[field]) ? jsx[field] : [];
            const converted = [];
            binds.forEach(item => converted.push(aiExprOp(item)));
            jsx[field] = converted;
        }
    });
    return jsx;
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
const applyField = (item = {}) => {
    // field删除key信息，有field代替
    if (item.hasOwnProperty('key')) {
        delete item.key;
    }
    // span的数值处理
    if (item.span) {
        item.span = Value.valueInt(item.span);
    }
    // 验证规则处理
    if (item.optionConfig && item.optionConfig.rules) {
        item.optionConfig.rules = ExprValue.applyRules(item.optionConfig.rules);
    }
    // Filter专用字段语法，防止逗号冲突
    if (0 < item.field.indexOf('`')) {
        // Filter专用语法解析
        item.field = item.field.replace('`', ',');
    }
    // 按钮专用处理
    if (item.optionJsx) {
        item.optionJsx = parseAction(item.optionJsx);
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
        const options = ExprValue.applyTree(rest);
        Object.assign(basic, options);
        ExprValue.applyColumn(basic);
        item = basic;
    }
    return item;
};
const aiExprTitle = (item) => {
    // title专用解析器
    if ("string" === typeof item && 0 <= item.indexOf("title")) {
        const kv = item.split("=");
        const result = {};
        // Ant-Design Form必须
        result.field = v4();
        // 解析特殊标题
        if ("string" === typeof kv[1]) {
            if (0 < kv[1].indexOf(",")) {
                const title = kv[1].split(",")[0];
                const className = kv[1].split(",")[1];
                result.title = title;
                result.className = className;
            } else {
                result[kv[0]] = kv[1];
            }
        }
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
        const options = ExprValue.applyTree(rest);
        // 属性追加（不覆盖）
        const result = Value.assign(basic, options, 1);
        applyField(result);
        item = result;
    } else if (item.field) {
        // 没有副作用的解析，让result也支持
        const result = ExprValue.applyTree(item);
        applyField(result);
        item = result;
    }
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
        const lefts = ExprValue.applyTree(rest);
        // 只合并criteria
        if (!lefts.params) lefts.params = {};
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
    _iterator(columns, (values = []) => ExprValue.applyColumn(parseItem(values, "column")),
        aiMetaColumn);
/**
 * 顺序：key, label, style
 */
const aiExprOption = (options = []) =>
    _iterator(options, (values = []) => parseItem(values, "option"), aiMetaOption).map(ExprValue.applyValue);

const aiMetaOption = (item = {}) => {
    if (item.metadata) {
        let each = parseItem(item.metadata, "option");
        if (item.items) each.items = aiExprOption(item.items);
        if (item.children) each.children = aiExprOption(item.children);
        item = each;
    }
    return item;
};

const aiExprIcon = (icons) => {
    if ("string" === typeof icons) {
        return parseItem(icons, "icon");
    } else if (U.isArray(icons)) {
        return _iterator(icons, (values = []) => parseItem(values, "icon"));
    }
};
/**
 * 顺序：title, key, icon, description, status
 */
const aiExprHelp = (steps = []) =>
    _iterator(ExprValue.applyArray(steps), (values = []) => parseItem(values, "steps"))
        .map(ExprValue.applyKey);
/**
 * 顺序：key, text, connectId, type, icon
 */
const aiExprButton = (buttons = [], props = {}) => _aiExprButton(buttons, props);
const aiExprDirect = (buttons = [], props = {}) => _aiExprButton(buttons, props, "direct");
const _aiExprButton = (buttons = [], props = {}, key = "button") =>
    _iterator(buttons, (values = []) => parseItem(values, key))
        .map(ExprValue.applyConnect).map(item => ExprValue.applyLoading(item, props));
const aiExprTabs = (items = [], props = {}) =>
    items.map(item => parseItem(item, "tabs"))
        .map(ExprValue.applyKey);
const aiExprOp = (button = "") => {
    if ("string" === typeof button) {
        const splitted = button.split(',');
        if (1 === splitted.length) {
            const item = {};
            item.id = button;
            item.key = button;
            item.text = "";
            return item;
        } else {
            const item = parseItem(button, "bind");
            if (!item.id) item.id = item.key;
            return item;
        }
    } else {
        return button;
    }
};
const aiExprFilter = (filter = "") => parseItem(filter, "filter");
const aiExprWindow = (literal = "") => {
    const item = parseItem(literal, "window");
    if (item.hasOwnProperty('key')) {
        delete item['key'];
    }
    if (item.hasOwnProperty('visible')) item.visible = "true" === (item.visible);
    if (item.hasOwnProperty('maskClosable')) item.maskClosable = "true" === (item.maskClosable);
    if (item.hasOwnProperty('width')) item.width = Value.valueInt(item.width);
    return item;
};
const aiExprDrawer = (drawer = "") => {
    const item = parseItem(drawer, "drawer");
    if (item.hasOwnProperty('key')) {
        delete item['key'];
    }
    if (item.hasOwnProperty('visible')) item.visible = "true" === (item.visible);
    if (item.hasOwnProperty('maskClosable')) item.maskClosable = "true" === (item.maskClosable);
    if (item.hasOwnProperty('closable')) item.closable = "true" === (item.closable);
    return item;
};
const aiExprPopover = (popover = "") => {
    const item = parseItem(popover, "popover");
    if (item.hasOwnProperty('key')) {
        delete item['key'];
    }
    if (item.hasOwnProperty('visible')) item.visible = "true" === (item.visible);
    if (item.hasOwnProperty('closable')) item.closable = "true" === (item.closable);
    return item;
};
const aiExprAction = (popover = "") => parseItem(popover, "action");
export default {
    aiExprFilter,
    aiExprHelp,
    aiExprIcon,
    aiExpr,
    aiExprColumn,
    aiExprOption,
    aiExprButton,
    aiExprOp,
    aiExprDirect,
    aiExprField,
    aiExprAjax,
    aiExprTabs,

    // 解析Dialog,Drawer,Popover
    aiExprAction,
    aiExprDrawer,
    aiExprPopover,
    aiExprWindow,
    // 对象解析
    aiMetaOption,
    aiMetaColumn,
    aiMetaField,
    // 特殊解析
    aiExprTitle,
    aiExprInit
};