// 导入外层
import Value from "../../element";

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
const jsxIcon = (field) => (item = {}, value) => {
    if (!item.optionJsx) item.optionJsx = {};
    if ("string" === typeof value) {
        item.optionJsx[field] = {
            type: value
        };
    }
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
                value = " ";
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
    /*
     * 自定义属性
     * 1）限制输入
     * - 只能输入数值
     * - 只能输入货币
     */
    normalize,
    sorter,                                       // 带参数的排序字段
    inscribe: jsxKv("inscribe"),            // readOnly = true 只读状态下需要显示文字为黑色
    _submit: itemValue("submit"),           // 按钮提交专用（旧版）
    fixed: itemValue("fixed"),              // 布局专用（旧版）
    group: itemValue("group"),              // 分组专用
    key: itemValue("key"),                  // 所有组件都可以用的 key
    moment: itemBoolean("moment"),          // 时间格式必须（初始化防止 undefined 或时间格式的 bug）
    /*
     * Ant-Design 标准属性
     */
    addonAfter: jsxValue("addonAfter"),                 // 后置插件
    addonBefore: jsxValue('addonBefore'),               // 前置插件
    prefix: jsxIcon('prefix'),                          // 前置文字
    suffix: jsxIcon('suffix'),                          // 后置文字
    placeholder: jsxKv("placeholder"),                  // 水印文字
    format: jsxValue("format"),                         // 时间 / 日期专用格式
    valuePropName: configValue("valuePropName"),        // 针对 CheckBox 或 Radio 专用
    withCredentials: jsxBoolean("withCredentials"),     // 上传专用
    text: jsxValue("text"),                             // 上传专用
    listType: jsxValue("listType"),                     // 上传专用
    allowClear: jsxBoolean("allowClear"),               // 允许清除
    rows: jsxInt("rows"),                               // TextArea 专用
    maxLength: jsxInt("maxLength"),                     // 长度限制
    min: jsxInt("min"),                                 // 最小值：数值专用
    max: jsxInt("max"),                                 // 最大值：数值专用
    precision: jsxInt("precision"),                     // 精度：数值专用
    step: jsxInt("step"),                               // 步进：数值专用
    className: itemValue("className"),                  // 通用 css 的 class
    itemClass: jsxItem("className"),                    // Item：外层的 css 的 class，（ <label>: <input> ）
    colon: jsxItemBoolean("colon"),                     // Item：是否显示冒号
    type: jsxValue("type"),                             // 类型解析
    showTime: jsxBoolean("showTime"),                   // 时间格式专用解析
    mode: jsxValue("mode"),                             // 时间日期面板专用
    maxTagCount: jsxInt("maxTagCount"),                 // 多选专用
    autoFocus: jsxBoolean("autoFocus"),                 // 自动焦点
    showSearch: jsxBoolean("showSearch"),               // 是否显示搜索框
    /*
     * 特殊属性用于设置宽度
     */
    labelSpan: jsxLayout("labelCol"),
    wrapperSpan: jsxLayout("wrapperCol"),
    /*
     * 状态专用属性
     */
    readOnly: jsxBoolean("readOnly"),
    disabled: jsxBoolean("disabled"),
    status: jsxItem("status"),
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
export default {
    parseTo
};