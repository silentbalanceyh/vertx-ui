import __Zn from './zero.module.dependency';
/*
 *  cell.optionConfig.normalize
 *  cell.params.sorter
 */
const normalize = (item = {}, value) => {
    if (!item.optionConfig) item.optionConfig = {};
    // Fix: https://gitee.com/silentbalanceyh/vertx-zero-scaffold/issues/I6W2BB
    item.optionConfig.normalize = value.replace(/ /g, '').replace(/:/g, ",");
};
const sorter = (item = {}, value) => {
    if (!item.params) item.params = {};
    if (!item.params.sorter) item.params.sorter = [];
    const sorters = value.split(';');
    sorters.forEach(sorterItem => item.params.sorter.push(sorterItem.replace('`', ',')));
};
// cell.optionConfig
const configValue = (field) => (item = {}, value) => {
    if (!item.optionConfig) item.optionConfig = {};
    item.optionConfig[field] = value;
};
// cell.optionJsx
const jsxValue = (field) => (item = {}, value) => {
    if (!item.optionJsx) item.optionJsx = {};
    item.optionJsx[field] = value;
};
const jsxBoolean = (field) => (item = {}, value) => {
    if (!item.optionJsx) item.optionJsx = {};
    item.optionJsx[field] = "true" === value;
};
const jsxTime = (field) => (item = {}, value) => {
    if (!item.optionJsx) item.optionJsx = {};
    if ("true" === value) {
        item.optionJsx[field] = true;
    } else {
        if ("null" === value) {
            item.optionJsx[field] = {
                defaultValue: null,
            }
        }
    }
}
const jsxInt = (field) => (item = {}, value) => {
    if (!item.optionJsx) item.optionJsx = {};
    item.optionJsx[field] = __Zn.valueInt(value);
};
const jsxIcon = (field) => (item = {}, value) => {
    if (!item.optionJsx) item.optionJsx = {};
    if ("string" === typeof value) {
        item.optionJsx[field] = {
            type: value
        };
    }
};
const jsxKv = (field) => (item = {}, value) => {
    if (!item.optionJsx) item.optionJsx = {};
    if (value && 0 < value.indexOf('`')) {
        item.optionJsx[field] = value.split('`');
    } else {
        if ("placeholder" === field) {
            if (__Zn.Env.SYNTAX_CLEAR === value) {
                value = " ";
            }
        }
        jsxValue(field)(item, value);
    }
};
// cell.optionItem
const itemLayout = (field, attr = "span") => (item = {}, value) => {
    if (!item.optionItem) item.optionItem = {};
    item.optionItem[field] = {};
    item.optionItem[field][attr] = __Zn.valueInt(value);
};
const itemValue = (field) => (item = {}, value) => {
    if (!item.optionItem) item.optionItem = {};
    item.optionItem[field] = value;
};
const itemBoolean = (field) => (item = {}, value) => {
    if (!item.optionItem) item.optionItem = {};
    item.optionItem[field] = "true" === value;
};
// cell
const fieldValue = (field) => (item = {}, value) => item[field] = value;
const fieldBoolean = (field) => (item = {}, value) => item[field] = "true" === value;
// (item, value)
export default {
    normalize,
    sorter,                                       // 带参数的排序字段
    inscribe: jsxKv("inscribe"),            // readOnly = true 只读状态下需要显示文字为黑色
    size: fieldValue("size"),                    // Button，尺寸
    shape: fieldValue("shape"),                  // Button, 属性处理
    _submit: fieldValue("submit"),           // 按钮提交专用（旧版）
    fixed: fieldValue("fixed"),              // 布局专用（旧版）
    group: fieldValue("group"),              // 分组专用
    key: fieldValue("key"),                  // 所有组件都可以用的 key
    moment: fieldBoolean("moment"),          // 时间格式必须（初始化防止 undefined 或时间格式的 bug）
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
    className: fieldValue("className"),                  // 通用 css 的 class
    itemClass: itemValue("className"),                    // Item：外层的 css 的 class，（ <label>: <input> ）
    colon: itemBoolean("colon"),                     // Item：是否显示冒号
    type: jsxValue("type"),                             // 类型解析
    showTime: jsxTime("showTime"),                   // 时间格式专用解析
    mode: jsxValue("mode"),                             // 时间日期面板专用
    maxTagCount: jsxInt("maxTagCount"),                 // 多选专用
    autoFocus: jsxBoolean("autoFocus"),                 // 自动焦点
    showSearch: jsxBoolean("showSearch"),               // 是否显示搜索框
    /*
     * 特殊属性用于设置宽度
     */
    labelSpan: itemLayout("labelCol"),
    wrapperSpan: itemLayout("wrapperCol"),
    /*
     * 状态专用属性
     */
    readOnly: jsxBoolean("readOnly"),
    disabled: jsxBoolean("disabled"),
    status: itemValue("status"),
    /*
     * 状态解析
     */
    closable: jsxBoolean("closable"),
    callback: jsxValue("callback"),
}