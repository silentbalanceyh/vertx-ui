// 导入第三方库
// 导入外层
import __Zo from 'zo';

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
 * @memberOf module:apply/zodiac
 * @param {String} literal 字面量专用数据。
 * @returns {Array} 返回解析后的数组。
 */
const applyArray = (literal) => __Zo.applyArray(literal);


/**
 * ## 「标准」`Ux.applyKey`
 *
 * 如果 item 中没有 key 存在，则赋值 uuid 的值。
 *
 * @memberOf module:apply/zodiac
 * @param {Object} item 需要赋值的 item 对象。
 * @return {Object}
 */
const applyKey = (item = {}) => __Zo.applyKv(item);


/**
 * ## 「标准」`Ux.applyRules`
 *
 * 解析验证规则：`optionConfig.rules` 专用方法。
 *
 * @memberOf module:apply/zodiac
 * @param {Array} rules 验证规则数组。
 * @returns {Array} 返回最终的数组信息。
 */
const applyRules = (rules = []) => __Zo.applyRules(rules);


/**
 * ## 「引擎」`Ux.applyColumn`
 *
 * 1. 如果 `key` 存在，则直接删除，防止 dataIndex 位移。
 * 2. 如果存在 `sorter` 属性，则执行布尔转换。
 *
 * @memberOf module:apply/zodiac
 * @param {Object} item 传入列配置。
 * @returns {Object} 返回处理过的对象。
 */
const applyColumn = (item = {}) => __Zo.applyColumn(item);


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
 * @memberOf module:apply/zodiac
 * @param {Object} item 需要赋值的 item 对象。
 * @return {Object}
 */
const applyValue = (item = {}) => __Zo.applyValue(item);
/**
 * ## 「引擎」`Ux.applyConnect`
 *
 * 执行button 上的按钮函数，主要用于连接点击`onClick`事件，一个按钮点击另外一个`id`的按钮，触发目标按钮的`onClick`。
 *
 * @memberOf module:apply/zodiac
 * @param {Object} item 需要赋值的 item 对象。
 * @return {Object}
 */
const applyConnect = (item = {}) => __Zo.applyConnect(item);


/**
 * ## 「标准」`Ux.applyLoading`
 *
 * 防重复提交专用的状态注入
 *
 * 1. 从 props 中读取`$submitting` 状态数据，该数据为 `DataObject` 类型。
 * 2. 从 DataObject中提取`loading`的布尔值，true表示正在执行 redux加载，false表示没执行。
 *
 * @memberOf module:apply/zodiac
 * @param {Object} item 需要赋值的 item 对象。
 * @param {Props} props React的属性信息。
 * @returns {Object} 返回处理后的属性信息。
 */
const applyLoading = (item = {}, props) => __Zo.applyLoading(item, props);


/**
 * ## 「标准」`Ux.applyKv`
 *
 * 解析Kv数组，基础解析完成过后，如果出现`$KV$`，那么解析后续表达式：`k1=v1,k2=v2`，然后将解析结果压入到item中。
 *
 * @memberOf module:apply/zodiac
 * @param {Object} item 需要赋值的 item 对象。
 * @param {Array} config 配置数据信息。
 * @param {Array} kvs `key=value`的参数对。
 * @returns {Object} 返回处理后的配置属性。
 */
const applyKv = (item = {}, config = [], kvs = []) => __Zo.applyKv(item, config, kvs);


/**
 * ## 「标准」`Ux.applyStyle`
 *
 * 如果存在 `style` 属性，则执行 `style` 属性的解析，生成 Object。
 *
 * @memberOf module:apply/zodiac
 * @param {Object} item 需要赋值的 item 对象。
 * @returns {Object} 返回处理后的属性信息。
 */
const applyStyle = (item = {}) => __Zo.applyStyle(item);
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
 * @memberOf module:apply/zodiac
 * @param {Object} item 需要赋值的 item 对象。
 * @param {Array} config 配置数据信息。
 * @param {Array} kvs `key=value`的参数对。
 * @returns {Object} 返回处理后的配置属性。
 */
const applyInput = (item = {}, config = [], kvs = []) => __Zo.applyInput(item, config, kvs);
/**
 * ## 「标准」`Ux.applyRow`
 *
 * @memberOf module:apply/zodiac
 * @param row
 * @param addition
 * @param config
 * @returns {*}
 */
const applyRow = (row = {}, addition = {}, config) => __Zo.applyRow(row, addition, config);

/**
 * ## 「标准」`Ux.applyView`
 *
 * @memberOf module:apply/zodiac
 * @param config
 * @param field
 * @returns {*}
 */
const applyView = (config = {}, field) => __Zo.applyView(config, field);

/**
 * ## 「标准」`Ux.applyRender`
 *
 * @memberOf module:apply/zodiac
 * @param renders
 * @param code
 * @returns {*|{}}
 */
const applyRender = (renders = {}, code) => __Zo.applyRender(renders, code);
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    applyRow,
    applyView,
    applyRender,
    applyArray,
    applyKey,
    applyRules,
    applyInput,
    applyStyle,
    applyLoading,
    applyKv,
    applyColumn,
    applyValue,
    applyConnect,
};