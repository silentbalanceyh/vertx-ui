// 导入第三方库
import {v4} from "uuid";
// 导入外层
import Abs from '../../abyss';
import Ut from '../../unity';
import Ele from "../../element";

// I.parser.down.js
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
    item.optionJsx[field] = Ele.valueInt(value);
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
    item.optionItem[field][attr] = Ele.valueInt(value);
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
    size: itemValue("size"),                    // Button，尺寸
    shape: itemValue("shape"),                  // Button, 属性处理
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
    /*
     * 状态解析
     */
    closable: jsxBoolean("closable"),
    callback: jsxValue("callback"),
};
const parseTo = (item = {}, literal = "") => {
    literal = literal.replace(/ /g, '');
    if (0 < literal.indexOf("=")) {
        const name = literal.split("=")[0];
        const value = literal.split("=")[1];
        if (PARSER[name]) {
            const fun = PARSER[name];
            fun(item, value);
        } else {
            console.error(`无法识别${name}=${value}，请提供解析器！`);
        }
    }
    return item;
};
// I.parser.rule.js
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


/**
 * ## 「标准」`Ux.applyArray`
 *
 * 直接解析字符串生成数组。
 *
 * 1. 如果输入是数组，则不执行解析。
 * 2. 如果输入是字符串，则执行解析。
 *
 * 使用代码如：
 *
 * ```js
 * const str = "item1,item2,item3";
 * const strArr = Ux.applyArray(str);
 * // strArr的值如：["item1","item2","item3"];
 * ```
 *
 * @memberOf module:_parser
 * @param {String} literal 字面量专用数据。
 * @returns {Array} 返回解析后的数组。
 */
const applyArray = (literal) => Abs.isArray(literal) ? literal : literal.split(',');


/**
 * ## 「标准」`Ux.applyKey`
 *
 * 如果 item 中没有 key 存在，则赋值 uuid 的值。
 *
 * @memberOf module:_parser
 * @param {Object} item 需要赋值的 item 对象。
 * @return {Object}
 */
const applyKey = (item = {}) => {
    if (!item.hasOwnProperty('key')) {
        item.key = v4();
    }
    return item;
};


/**
 * ## 「标准」`Ux.applyRules`
 *
 * 解析验证规则：`optionConfig.rules` 专用方法。
 *
 * @memberOf module:_parser
 * @param {Array} rules 验证规则数组。
 * @returns {Array} 返回最终的数组信息。
 */
const applyRules = (rules = []) => {
    const processed = [];
    rules.forEach(rule => {
        if ("string" === typeof rule) {
            const result = parseRule(rule);
            if (result) {
                processed.push(result);
            }
        } else {
            processed.push(rule);
        }
    });
    return processed;
};


/**
 * ## 「引擎」`Ux.applyColumn`
 *
 * 1. 如果 `key` 存在，则直接删除，防止 dataIndex 位移。
 * 2. 如果存在 `sorter` 属性，则执行布尔转换。
 *
 * @memberOf module:_parser
 * @param {Object} item 传入列配置。
 * @returns {Object} 返回处理过的对象。
 */
const applyColumn = (item = {}) => {
    if (item.hasOwnProperty('key')) {
        delete item.key;
    }
    if (item.hasOwnProperty("sorter")) {
        item.sorter = Boolean(item.sorter);
    }
    return item;
};


/**
 * ## 「引擎」`Ux.applyValue`
 *
 * 如果 item 中没有 value 而只包含了 key，则执行赋值，拷贝 key 给 value 属性：
 *
 * ```js
 *
 * const item = {
 *     key: "itemKey"
 * };
 * // item.value = item.key
 * const processed = Ux.applyValue(item);
 * ```
 *
 * @memberOf module:_parser
 * @param {Object} item 需要赋值的 item 对象。
 * @return {Object}
 */
const applyValue = (item = {}) => {
    if (item.hasOwnProperty("key") && !item.hasOwnProperty("value")) {
        item.value = item.key;
    }
    return item;
};
/**
 * ## 「引擎」`Ux.applyConnect`
 *
 * 执行button 上的按钮函数，主要用于连接点击`onClick`事件，一个按钮点击另外一个`id`的按钮，触发目标按钮的`onClick`。
 *
 * @memberOf module:_parser
 * @param {Object} item 需要赋值的 item 对象。
 * @return {Object}
 */
const applyConnect = (item = {}) => {
    if (item.hasOwnProperty("connectId")) {
        const connectId = item.connectId;
        item.onClick = () => Ut.connectId(connectId);
        delete item.connectId;
    }
    return item;
};


/**
 * ## 「标准」`Ux.applyLoading`
 *
 * 防重复提交专用的状态注入
 *
 * 1. 从 props 中读取`$submitting` 状态数据，该数据为 `DataObject` 类型。
 * 2. 从 DataObject中提取`loading`的布尔值，true表示正在执行 redux加载，false表示没执行。
 *
 * @memberOf module:_parser
 * @param {Object} item 需要赋值的 item 对象。
 * @param {Props} props React的属性信息。
 * @returns {Object} 返回处理后的属性信息。
 */
const applyLoading = (item = {}, props) => {
    const {$submitting} = props;
    if ($submitting) {
        const submitting = $submitting.is() ? $submitting.to() : {};
        item.loading = submitting.loading;
    }
    return item;
};


/**
 * ## 「标准」`Ux.applyKv`
 *
 * 解析Kv数组，基础解析完成过后，如果出现`$KV$`，那么解析后续表达式：`k1=v1,k2=v2`，然后将解析结果压入到item中。
 *
 * @memberOf module:_parser
 * @param {Object} item 需要赋值的 item 对象。
 * @param {Object} config 配置数据信息。
 * @param {Array} kvs `key=value`的参数对。
 * @returns {Object} 返回处理后的配置属性。
 */
const applyKv = (item = {}, config = [], kvs = []) => {
    if (kvs.length >= config.length) {
        if (item.hasOwnProperty("$KV$")) {
            for (let idx = config.length - 1; idx < kvs.length; idx++) {
                const literal = kvs[idx];
                parseTo(item, literal);
            }
            delete item['$KV$'];
        }
    }
    return item;
};


/**
 * ## 「标准」`Ux.applyStyle`
 *
 * 如果存在 `style` 属性，则执行 `style` 属性的解析，生成 Object。
 *
 * @memberOf module:_parser
 * @param {Object} item 需要赋值的 item 对象。
 * @returns {Object} 返回处理后的属性信息。
 */
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
/**
 * ## 「引擎」`Ux.applyItem`
 *
 * 解析表单 item 专用的方法信息，简化版处理：
 *
 * ```json
 * {
 *     "metadata": "...",
 *     "optionJsx": "...",
 *     "optionConfig": "...",
 *     "optionItem": "..."
 * }
 * ```
 *
 * @memberOf module:_parser
 * @param {Object} item 需要赋值的 item 对象。
 * @param {Object} config 配置数据信息。
 * @param {Array} kvs `key=value`的参数对。
 * @returns {Object} 返回处理后的配置属性。
 */
const applyItem = (item = {}, config = [], kvs = []) => {
    /*
     * 查找定义的 $KV$ 的索引
     */
    let kvIndex = -1;
    config.forEach((item, index) => {
        if ("$KV$" === item) {
            kvIndex = index;
        }
    });
    /*
     * kvs 的变幻
     * 1）超过 $KV$ 索引的位置执行 '' 的压缩，也就是 $KV$ 之后丢弃掉空字符串
     * 2）压缩的时候需要保留 $KV$ 之前的应用
     */
    const compress = [];
    if (0 < kvIndex) {
        kvs.forEach((kv, index) => {
            if (index < kvIndex) {
                compress.push(kv);
            } else {
                if (kv) {
                    compress.push(kv);
                }
            }
        });
    } else {
        kvs.forEach(kv => compress.push(kv));
    }
    /*
     * 执行压缩过后的处理操作
     */
    let $item = Abs.immutable(item);
    for (let idx = 0; idx < config.length; idx++) {
        const name = config[idx];
        if (compress[idx]) {
            if (0 < name.indexOf(".")) {
                $item = $item.setIn(name.split('.'), compress[idx]);
            } else {
                $item = $item.set(name, compress[idx]);
            }
        }
    }
    return $item.toJS();
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
};