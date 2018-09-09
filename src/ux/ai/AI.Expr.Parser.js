import Value from '../Ux.Value';

const normalize = (item = {}, value) => {
    if (!item.optionConfig) item.optionConfig = {};
    item.optionConfig.normalize = value.replace(/ /g, '').replace(":", ",");
};
const configValue = (field) => (item = {}, value) => {
    if (!item.optionConfig) item.optionConfig = {};
    item.optionConfig[field] = value;
};
const jsxValue = (field) => (item = {}, value) => {
    if (!item.optionJsx) item.optionJsx = {};
    item.optionJsx[field] = value;
};
const jsxBoolean = (field) => (item = {}, value) => {
    if (!item.optionJsx) item.optionJsx = {};
    item.optionJsx[field] = "true" === value;
};
const jsxInt = (field) => (item = {}, value) => {
    if (!item.optionJsx) item.optionJsx = {};
    item.optionJsx[field] = Value.valueInt(value);
};
const sorter = (item = {}, value) => {
    if (!item.params) item.params = {};
    if (!item.params.sorter) item.params.sorter = [];
    const sorters = value.split(';');
    sorters.forEach(sorterItem => item.params.sorter.push(sorterItem.replace('`', ',')));
};
const jsxKv = (field) => (item = {}, value) => {
    if (!item.optionJsx) item.optionJsx = {};
    if (value && 0 < value.indexOf('`')) {
        item.optionJsx[field] = value.split('`');
    } else {
        if ("placeholder" === field) {
            if ("$CLEAR$" === value) {
                value = " "
            }
        }
        jsxValue(field)(item, value);
    }
};
const jsxLayout = (field, attr = "span") => (item = {}, value) => {
    if (!item.optionItem) item.optionItem = {};
    item.optionItem[field] = {};
    item.optionItem[field][attr] = Value.valueInt(value);
};
const jsxItem = (field) => (item = {}, value) => {
    if (!item.optionItem) item.optionItem = {};
    item.optionItem[field] = value;
};
const jsxItemBoolean = (field) => (item = {}, value) => {
    if (!item.optionItem) item.optionItem = {};
    item.optionItem[field] = "true" === value;
};
const itemValue = (field) => (item = {}, value) => item[field] = value;
const itemBoolean = (field) => (item = {}, value) => item[field] = "true" === value;
const PARSER = {
    normalize,
    addonAfter: jsxValue("addonAfter"),
    addonBefore: jsxValue('addonBefore'),
    readOnly: jsxBoolean("readOnly"),
    placeholder: jsxKv("placeholder"),
    valuePropName: configValue("valuePropName"),
    format: jsxValue("format"),
    listType: jsxValue("listType"),
    text: jsxValue("text"),
    labelSpan: jsxLayout("labelCol"),
    wrapperSpan: jsxLayout("wrapperCol"),
    allowClear: jsxBoolean("allowClear"),
    sorter,
    rows: jsxInt("rows"),
    className: itemValue("className"),
    // 自定义属性
    _submit: itemValue("submit"),
    fixed: itemValue("fixed"),
    // 分组专用
    group: itemValue("group"),
    moment: itemBoolean("moment"),
    // 特殊item属性
    itemClass: jsxItem("className"),
    colon: jsxItemBoolean("colon"),
    type: jsxValue("type"),
    status: jsxItem("status")
};
const parseTo = (item = {}, literal = "") => {
    literal = literal.replace(/ /g, '');
    if (0 < literal.indexOf("=")) {
        const name = literal.split("=")[0];
        const value = literal.split("=")[1];
        if (PARSER[name]) {
            const fun = PARSER[name];
            fun(item, value);
        }
    }
    return item;
};
const ruleRequired = (item = []) => {
    const config = {};
    config.required = true;
    config.message = item[0] ? item[0] : "";
    return config;
};
const ruleRequiredState = (status = true) => (item = {}) => {
    const config = {};
    config.validator = "required";
    config.message = item[0] ? item[0] : "";
    config.status = status;
    return config;
};
const RULER = {
    required: ruleRequired,
    requiredTrue: ruleRequiredState(true),
    requiredFalse: ruleRequiredState(false)
};
const parseRule = (rule = "") => {
    const rules = rule.replace(/ /g, '').split(',');
    const ruler = rules.shift();
    if (RULER[ruler]) {
        return RULER[ruler](rules);
    }
};
export default {
    parseTo,
    parseRule
}