// 导入第三方库
import U from 'underscore';
import {v4} from 'uuid';
// 导入当前目录
import Apply from './O.apply';
import Parser from './I.parser.up';
// 导入外层
import Value from '../../element';
import Abs from '../../abyss';

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
        item.optionConfig.rules = Apply.applyRules(item.optionConfig.rules);
    }
    // Filter专用字段语法，防止逗号冲突
    if (0 < item.field.indexOf('`')) {
        // Filter专用语法解析
        item.field = item.field.replace('`', ',');
    }
    // 按钮专用处理
    if (item.optionJsx) {
        item.optionJsx = Parser.parseAction(item.optionJsx);
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
        const basic = Parser.parseItem(metadata, "column");
        const options = Value.valueLadder(rest);
        Object.assign(basic, options);
        Apply.applyColumn(basic);
        item = basic;
    }
    return item;
};
const aiExprTitle = (item) => {
    // title专用解析器
    if ("string" === typeof item
        && 0 <= item.indexOf("title")
        && 0 > item.indexOf(",")    // 防止出现title字段
    ) {
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
/**
 * 顺序：field, optionItem.label, span, optionJsx.style.width, render, $KV$
 */
const aiExprField = (literal = "") => applyField(Parser.parseItem(literal, "field"));
/**
 * 如果是Object：只有metadata，然后包含各种options
 */
const aiExprFieldEx = (item = {}) => {
    if (item.metadata) {
        const {metadata, ...rest} = item;
        const basic = Parser.parseItem(metadata, "field");
        const options = Value.valueLadder(rest);
        // 属性追加（不覆盖）
        const result = Abs.assign(basic, options, 1);
        applyField(result);
        item = result;
    } else if (item.field) {
        // 没有副作用的解析，让result也支持
        const result = Value.valueLadder(item);
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
        item = Parser.parseItem(metadata, "ajax");
        // 分页参数执行整数
        const pager = item.params.pager;
        if (pager) {
            pager.page = Value.valueInt(pager.page);
            pager.size = Value.valueInt(pager.size);
        }
        const lefts = Value.valueLadder(rest);
        // 只合并criteria
        if (!lefts.params) lefts.params = {};
        item.params.criteria = lefts.params.criteria;
    }
    return item;
};
/**
 * 顺序：name, icon, style
 */
const aiExpr = (literal = "") => Parser.parseItem(literal, "flag");
/**
 * 顺序：dataIndex, title, $render, sorter
 */
const aiExprColumn = (columns = []) =>
    _iterator(columns, (values = []) =>
            Apply.applyColumn(Parser.parseItem(values, "column")),
        aiMetaColumn)
        .map(column => Value.valueLadder(column)); /* 列的拉平处理 */
/**
 * 顺序：key, label, style
 */
const aiExprOption = (options = []) =>
    _iterator(options, (values = []) => Parser.parseItem(values, "option"), aiMetaOption).map(Apply.applyValue);

const aiMetaOption = (item = {}) => {
    if (item.metadata) {
        let each = Parser.parseItem(item.metadata, "option");
        if (item.items) each.items = aiExprOption(item.items);
        if (item.children) each.children = aiExprOption(item.children);
        item = each;
    }
    return item;
};

const aiExprIcon = (icons) => {
    if ("string" === typeof icons) {
        return Parser.parseItem(icons, "icon");
    } else if (U.isArray(icons)) {
        return _iterator(icons, (values = []) => Parser.parseItem(values, "icon"));
    }
};
/**
 * 顺序：title, key, icon, description, status
 */
const aiExprHelp = (steps = []) =>
    _iterator(Apply.applyArray(steps), (values = []) => Parser.parseItem(values, "steps"))
        .map(Apply.applyKey);
/**
 * 顺序：key, text, connectId, type, icon
 */
const aiExprButton = (buttons = [], props = {}) => _aiExprButton(buttons, props);
const aiExprDirect = (buttons = [], props = {}) => _aiExprButton(buttons, props, "direct");
const _aiExprButton = (buttons = [], props = {}, key = "button") =>
    _iterator(buttons, (values = []) => Parser.parseItem(values, key))
        .map(Apply.applyConnect).map(item => Apply.applyLoading(item, props));
const aiExprTabs = (items = [], props = {}) =>
    items.map(item => Parser.parseItem(item, "tabs"))
        .map(Apply.applyKey);
const aiExprOp = (button = "") => {
    let parsed;
    if ("string" === typeof button) {
        const splitted = button.split(',');
        if (1 === splitted.length) {
            const item = {};
            item.id = button;
            item.key = button;
            item.text = "";
            parsed = item;
        } else {
            const item = Parser.parseItem(button, "bind");
            parsed = item;
        }
    } else {
        parsed = button;
    }
    if (!parsed.id) parsed.id = parsed.key;
    return parsed;
};
const aiExprFilter = (filter = "") => Parser.parseItem(filter, "filter");
const aiExprWindow = (literal = "") => {
    const item = Parser.parseItem(literal, "window");
    if (item.hasOwnProperty('key')) {
        delete item['key'];
    }
    if (item.hasOwnProperty('visible')) item.visible = "true" === (item.visible);
    if (item.hasOwnProperty('maskClosable')) item.maskClosable = "true" === (item.maskClosable);
    if (item.hasOwnProperty('width')) item.width = Value.valueInt(item.width);
    return item;
};
const aiExprDrawer = (drawer = "") => {
    const item = Parser.parseItem(drawer, "drawer");
    if (item.hasOwnProperty('key')) {
        delete item['key'];
    }
    if (item.hasOwnProperty('visible')) item.visible = "true" === (item.visible);
    if (item.hasOwnProperty('maskClosable')) item.maskClosable = "true" === (item.maskClosable);
    if (item.hasOwnProperty('closable')) item.closable = "true" === (item.closable);
    return item;
};
const aiExprPopover = (popover = "") => {
    const item = Parser.parseItem(popover, "popover");
    if (item.hasOwnProperty('key')) {
        delete item['key'];
    }
    if (item.width) item.width = Value.valueInt(item.width);
    if (item.hasOwnProperty('visible')) item.visible = "true" === (item.visible);
    if (item.hasOwnProperty('closable')) item.closable = "true" === (item.closable);
    return item;
};
const aiExprAction = (popover = "") => Parser.parseItem(popover, "action");
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
    aiExprFieldEx,

    aiExprAjax,
    aiExprTabs,

    // 解析Dialog,Drawer,Popover
    aiExprAction,
    aiExprDrawer,
    aiExprPopover,
    aiExprWindow,
    // 对象解析
    //aiMetaOption,
    //aiMetaColumn,
    // 特殊解析
    aiExprTitle
};