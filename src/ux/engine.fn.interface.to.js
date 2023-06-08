import __Zi from 'zi';
import __Zn from 'zone';

/**
 * ## 「标准」`Ux.toHeight`
 *
 * 根据修正宽度计算组件最大高度信息，按分辨率智能切换。
 *
 * @memberOf module:to/zion
 * @param {Number} adjust 修正高度值。
 * @returns {number} 返回最终计算的页面高度值。
 */
const toHeight = (adjust = 0) => __Zi.toHeight(adjust);


/**
 * ## 「引擎」`Ux.toGrid`
 *
 * 生成 Grid 布局的宽度运算，表单中专用，1、2、3、4列不同布局处理。
 *
 * ```json
 * {
 *     grid: "数值，不同数值对应不同宽度"
 * }
 * ```
 *
 *
 * | grid值 | 宽度 |
 * |:---|:---|
 * | 5 | 20% |
 * | 4 | 25% |
 * | 3 | 33.33% |
 * | 2 | 50% |
 * | 1 | 100% |
 *
 * @memberOf module:to/zion
 * @param {Object} config 传入配置数据
 * @returns {Object} 返回 style 属性
 */
const toGrid = (config = {}) => __Zi.toGrid(config);


/**
 * ## 「引擎」`Ux.toGridSpan`
 *
 * 根据列计算 span / offset 等相关信息，针对布局执行核心操作。
 *
 * @memberOf module:to/zion
 * @param {Number} columns 列信息
 * @param {Number} index 是否纳入 index 执行计算
 * @return {Object} 返回可用于 Col 的属性
 */
const toGridSpan = (columns = 4, index = 0) => __Zi.toGridSpan(columns, index);


/**
 * ## 「标准」`Ux.toCss`
 *
 * 执行CSS前缀的注入流程，根据环境变量中配置的`Z_CSS_PREFIX`来追加CSS类名的前缀。
 *
 * @memberOf module:to/zion
 * @param {String} name 当前类名称。
 * @returns {string} 返回带前缀的 css 类名。
 */
const toCss = (name) => __Zi.toCss(name);
/**
 * ## 「标准」`Ux.toCssLogo`
 *
 * @memberOf module:to/zion
 * @param reference
 * @returns {*}
 */
const toCssLogo = (reference) => __Zi.toCssLogo(reference);
/**
 * ## 「标准」`Ux.toMessage`
 *
 * 消息配置转换函数
 *
 * 1. error = true：最终调用 message.error 处理。
 * 2. error = false：最终调用 message.success 处理。
 *
 * @memberOf module:to/zone
 * @param {String} content 内容信息。
 * @param {boolean} error 是否呈现错误信息。
 * @returns {Object} 返回消息配置。
 */
const toMessage = (content, error = false) =>
    __Zn.toMessage(content, error);
/**
 * ## 「标准」`Ux.toKey`
 *
 * 生成 Assist / Tabular 专用键值数据。
 *
 * @memberOf module:to/zone
 * @param {String} key `Assist/Tabular`辅助数据的 key 值。
 * @param {boolean} assist 是否 Assist 直接数据。
 * @returns {string} 生成最终键。
 */
const toKey = (key, assist = true) =>
    __Zn.toKey(key, assist);
/**
 * ## 「标准」`Ux.toLink`
 *
 * 1. 如果 data 是 Object，则针对 data 中的任何一个对象的 `uri` 执行路由转换。
 * 2. 如果 data 是 Array，则针对 data 中的任何一个元素对象执行 `uri` 转换。
 * 3. 如果 data 是 String，则直接执行转换。
 *
 * @memberOf module:to/zion
 * @param {String|Object} data 输入的转换源。
 * @param {DataObject} $app 应用程序对象。
 * @returns {string|any} 转换的最终数据。
 */
const toLink = (data, $app) =>
    __Zi.toLink(data, $app);
/**
 * ## 「引擎」`Ux.toX`
 *
 * 根据列信息自动计算表格宽度，计算值会包含多种不同的列值。
 *
 * @memberOf module:to/zion
 * @param {Array} columns 列配置数组
 * @returns {number} 返回最终宽度
 */
const toX = (columns = []) =>
    __Zi.toX(columns);

/**
 * ## 「标准」`Ux.toWidth`
 *
 * 如果是中文字符返回长度 2，如果是英文字符返回长度 1，可计算像素。
 *
 * @memberOf module:to/zone
 * @param {String} literal 输入字符。
 * @returns {number} 返回字符宽度。
 */
const toWidth = (literal = "") => __Zn.toWidth(literal);
/**
 * ## 「引擎」`Ux.toPagination`
 *
 * data的数据结构
 *
 * ```json
 * {
 *     "list": [],
 *     "count":10
 * }
 * ```
 *
 * 查询条件类
 *
 * ```json
 * {
 *     "pager":{
 *         "page": 1,
 *         "size": 10
 *     },
 *     "criteria": {
 *
 *     },
 *     "sorter":[],
 *     "projection":[]
 * }
 * ```
 *
 * @memberOf module:to/zone
 * @param {Object} data 数据信息
 * @param {Object} query 查询条件专用雷
 * @param {Object} config 额外的配置
 * @returns 返回生成好的 Table 专用的 pagination
 */
const toPagination = (data = {}, query = {}, config = {}) =>
    __Zn.toPagination(data, query, config);


/**
 * ## 「标准」`Ux.toHeightState`
 *
 * 高度修正专用的状态生成器：
 *
 * ```json
 * {
 *     $heightStyle: {
 *          style: {
 *              maxHeight
 *          }
 *     },
 *     $heightValue: number
 * }
 * ```
 *
 * @memberOf module:to/zion
 * @param {Number} adjust 修正高度值。
 * @returns {Object} 返回最终状态的数据结构
 */
const toHeightState = (adjust) => __Zi.toHeightState(adjust);
/**
 * ## 「标准」`Ux.toFileSize`
 *
 * 读取文件大小专用方法，解析成合适方法
 *
 * @memberOf module:to/zone
 * @param {Number} value 修正高度值。
 * @param {String} unit 单位信息
 * @returns {Object} 返回最终状态的数据结构
 */
const toFileSize = (value, unit) =>
    __Zn.toFileSize(value, unit);
/**
 * ## 「标准」`Ux.toCssClass`
 *
 * @memberOf module:to/zone
 * @param jsxOrExpr
 * @param inClass
 * @returns {String}
 */
const toCssClass = (jsxOrExpr, inClass) =>
    __Zn.toCssClass(jsxOrExpr, inClass);
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    toHeight,
    toHeightState,
    /**
     * ## 「标准」`Ux.toHeightStyle`
     *
     * @memberOf module:to/zion
     * @param adjust
     * @returns {*}
     */
    toHeightStyle: (adjust = 0) => __Zi.toHeightStyle(adjust),
    toGrid,
    toGridSpan,
    toMessage,
    toFileSize,

    toCss,  // /* 根据 CSS_PREFIX 前缀计算的 Class */
    /**
     * ## 「标准」`Ux.toCssA`
     *
     * @memberOf module:to/zion
     * @param callback
     * @returns {*}
     */
    toCssA: (callback) => __Zi.toCssA(callback),
    toCssLogo,
    toCssClass,

    toKey,  // 生成 assist / tabular 相关 key
    toLink,
    toX,    // 表格专用列生成
    toWidth, // 计算字符串长度，中文字 x 2

    toPagination, // 根据传入的数据转换
}