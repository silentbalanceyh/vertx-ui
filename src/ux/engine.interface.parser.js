// 导入外层执行
import __Zo from 'zo';
// --------------------- parsing 基础方法

/**
 * ## 「引擎」`Ux.parseValue`
 *
 * 用于执行不同类型的值解析专用数据，基础语法如下：
 *
 * ```shell
 *     <TYPE>:<EXPR>
 * ```
 *
 * 其中：
 *
 * * TYPE：是当前支持的解析器类型。
 * * EXPR：解析表达式。
 *
 * ### 1. 解析器
 *
 * > `OPERATOR`类型时使用特殊的操作字段名，必须使用`""`。
 *
 * | 类型 | 说明 | 例子 |
 * |:--- |:---|:---|
 * | BOOL | 布尔表达式 | BOOL:true, BOOL:false |
 * | OPERATOR | 连接符 | "OPERATOR:AND"，字段名为"" |
 * | FIX | 固定值 | FIX:test |
 * | DELAY | 延迟渲染 | （无）|
 * | ENUM | 枚举值 | ENUM:a`b`c |
 * | FORM | 表单值 | FORM:username |
 * | DATUM | 辅助数据 | DATUM:source=<v1> |
 * | UNIQUE | 唯一数据 | DATUM的变种 |
 * | PROP | 属性值 | PROP:app |
 * | ROUTE | 路由值 | ROUTE:item |
 * | STATE | 状态值 | STATE:query |
 * | USER | 登录用户值 | USER:email |
 *
 * > 值解析器在很多场景中都会使用，主要基于当前方法来解析值相关信息。
 *
 * @memberOf module:parse/zodiac
 * @method parseValue
 * @param {String} valueOrExpr 值处理专用表达式。
 * @param {Object|ReactComponent} reference React对应组件引用。
 * @return {any} 解析过后的值信息。
 */
const parseValue = (valueOrExpr, reference) => __Zo.parseValue(valueOrExpr, reference);
/**
 * ## 「引擎」`Ux.parseField`
 *
 * 解析查询条件表达式，最终生成合法的查询函数：
 *
 * ```json
 * {
 *     field: "字段名",
 *     op: "操作符"
 * }
 * ```
 *
 * @memberOf module:parse/zodiac
 * @param {String} input 输入查询字段表达式。
 * @return {Object}
 */
const parseField = (input) => __Zo.parseField(input);
/**
 * ## 「引擎」`Ux.parseInput`
 *
 * 针对Object中的字段和值对应的合并解析流程，解析完整对象，每个对象的值执行一次`parseValue`解析。
 *
 * @memberOf module:parse/zodiac
 * @param {Object} input 传入的数据相关值信息。
 * @param {Props} props 当前组件的属性信息。
 * @param {State} state 当前组件的状态信息。
 * @param {Object} option 解析过程动态选项（一般开发传入）。
 * @return {Object} 解析的最终结果值。
 */
const parseInput = (input = {}, {props, state, option}) =>
    __Zo.parseInput(input, {props, state, option});
/**
 * ## 「引擎」`Ux.parseColumn`
 *
 * @memberOf module:parse/zodiac
 * @param columns
 * @param reference
 * @returns {*}
 */
const parseColumn = (columns = [], reference) =>
    __Zo.parseColumn(columns, reference);
/**
 * ## 「引擎」`Ux.parsePosition`
 *
 * @memberOf module:parse/zodiac
 * @param positionExpr
 * @param reference
 * @returns {*|string}
 */
const parsePosition = (positionExpr, reference) => __Zo.parsePosition(positionExpr, reference);
/**
 * ## 「引擎」`Ux.parseParameter`
 *
 * @memberOf module:parse/zodiac
 * @param parameter
 * @param reference
 */
const parseParameter = (parameter = {}, reference) => __Zo.parseParameter(parameter, reference);
/**
 * ## 「引擎」`Ux.parseSource`
 *
 * @memberOf module:parse/zodiac
 * @param expr
 * @returns {*}
 */
const parseSource = (expr = "") => __Zo.parseSource(expr);
/**
 * ## 「引擎」`Ux.parseDatum`
 *
 * @memberOf module:parse/zodiac
 * @param reference
 * @param config
 * @param filter
 * @returns {*}
 */
const parseDatum = (reference, config = {}, filter = () => true) =>
    __Zo.parseDatum(reference, config, filter);
/**
 * ## 「引擎」`Ux.parseOption`
 *
 * @memberOf module:parse/zodiac
 * @param reference
 * @param config
 * @param fnFilter
 * @returns {*}
 */
const parseOption = (reference, config, fnFilter = () => true) =>
    __Zo.parseOption(reference, config, fnFilter);
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    parseField,
    parseInput,
    parseValue,
    parseColumn,
    parsePosition,
    parseParameter,
    parseSource,
    parseDatum,
    parseOption,
}