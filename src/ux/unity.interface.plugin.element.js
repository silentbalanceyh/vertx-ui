import __Zn from 'zone';
import __Zo from 'zo';
import __Zs from 'zs';

/**
 * ## 「引擎」`Ux.valueExpr`
 *
 * （通常内部）解析表达式强化方法，主要用于解析Zero中带`:`的自定义表达式相关信息。
 *
 * ```js
 * const user = {
 *     username: "Lang",
 *     age: 12
 * };
 *
 * const keepValue = Ux.valueExpr("你的名字:username", user, true);
 * // 输出：你的名字Lang。
 * // 执行后 user 的值为：{ username: "Lang", age: 12 };
 *
 * const removeValue = Ux.valueExpr("你的名字:username", user);
 * // 输出：你的名字Lang。
 * // 之后后 user 的值：{ age:12 }; 原始的 username 已经从输入Object中移除。
 * ```
 *
 * 注意第三参数，第三参数会对传入参数执行保留或不保留的两种方案，如果 keep = false（默认），那么在执行过后，原始入参中
 * 被替换的参数属性会被移除掉，而 keep = true 时则不会移除，会保留其数据信息，并且注意该方法和`Ux.formatExpr`的区别，
 * 通常`valueExpr`是直接使用，建议在内部调用，而`formatExpr`会有更多操作，所以提供给用户调用。
 *
 * @memberOf module:value/zone
 * @param {String} expr 传入的表达式或字段名。
 * @param {Object} data 记录信息。
 * @param {boolean} keep 格式化过后是否保留原始的值。
 * @return {string} 返回最终格式化后的数据。
 */
const valueExpr = (expr = "", data = {}, keep = false) =>
    __Zn.valueExpr(expr, data, keep);
/**
 * ## 「引擎」`Ux.valueTran`
 *
 * 专用解析工作流处理中的 data 节点信息，data 的数据格式：
 *
 * 1. 字符串："k=v:t,k=v:t"
 * 2. 数组类型：[]
 * 3. 对象类型：{} -> 直接处理
 *
 * 唯一的区别是对象和数组中都支持 `dataIngest` 方法对数据源的处理，此处会借用reference
 *
 * @memberOf module:value/zest
 * @param {Object} params 值解析处理
 * @param {String|Array|Object} data 值解析处理
 * @param reference
 * @return {Object} 返回解析后的对象信息
 */
const valueTran = (params = {}, data, reference) =>
    __Zs.valueTran(params, data, reference);
/**
 * ## 「引擎」`Ux.valueIndicate`
 *
 * 专用解析工作流处理中带有`indicator`字段配置的数据格式
 *
 * @memberOf module:value/zest
 * @param {Object} params 值解析处理
 * @param {Object} config 配置信息
 * @param reference
 * @return {Object} 返回解析后的对象信息
 */
const valueIndicate = (params = {}, config = {}, reference) =>
    __Zs.valueIndicate(params, config, reference);
/**
 * ## 「引擎」`Ux.valueFind`
 *
 * 配置解析统一调用函数（特殊应用）
 *
 * 1. 如果 attrPath 长度为1，则直接提取 target 中的：`target[attrPath[0]]`。
 * 2. 如果长度大于2，则先提取`target[attrPath[0]]`，其次提取第二阶段名称，暂时只支持长度为2的模式。
 *
 * 内部执行函数代码示例。
 *
 * ```js
 PROP: (expression, {props}) => fnPredicate("PROP", expression, () => {
     const path = expression.split('.'); // 路径解析
     return T.valueFind(props, path);
 }),
 * ```
 *
 * @memberOf module:value/zone
 * @param {any} target 被查找的引用信息。
 * @param {Array} attrPath 属性路径信息。
 * @return {any|*} 返回最终解析的属性值。
 */
const valueFind = (target = {}, attrPath = []) => __Zn.valueFind(target, attrPath);
/**
 * ## 「引擎」`Ux.toFieldName`
 * @memberOf module:to/zest
 * @param cell
 */
const toFieldName = (cell) => __Zs.toFieldName(cell);
/**
 * ## 「引擎」`Ux.toLimit`
 *
 * 功能和 `valueLimit`相同，同样的执行操作，用于不同的场景。
 *
 * * `valueLimit` 属于标准函数。
 * * `toLimit` 在自定义组件中调用。
 *
 * @memberOf module:to/zodiac
 * @param {Props} props React组件的属性值。
 * @param {Array} limits 需要限制的 keys 的值。
 * @return {Object} 返回限制过后的属性值。
 */
const toLimit = (props = {}, limits = []) => __Zo.yoLimit(props, limits);
/**
 * ## 「引擎」`Ux.toForm`
 *
 * 将两个form的配置进行合并的专用操作，主要合并项：
 *
 * 1. ui：两个表单直接连接。
 * 2. hidden：两个表单的隐藏字段连接。
 * 3. initial：初始值二者合并。
 * 4. mapping：映射值二者合并。
 * 5. op：执行操作（包括操作权限）的合并。
 * 6. io：「新版」执行转换（输入转换、提交转换）的合并
 * 7. model：「新版」窗口专用
 * 8. assist：「新版」辅助数据专用
 *
 * @memberOf module:to/zodiac
 * @param {Object} staticForm 静态表单配置。
 * @param {Object} dynamicForm 动态表单配置。
 * @return {Object} 返回最终的表单配置。
 */
const toForm = (staticForm = {}, dynamicForm = {}) =>
    __Zo.toForm(staticForm, dynamicForm);
/**
 * ## 「引擎」`Ux.toFormUi`
 *
 * @memberOf module:to/zodiac
 * @param ui
 * @param segment
 * @returns {*}
 */
const toFormUi = (ui = [], segment = {}) =>
    __Zo.toFormUi(ui, segment);
/**
 * ## 「引擎」`Ux.itField`
 *
 * @memberOf module:it/zest
 * @param form
 * @param consumer
 */
const itField = (form = {}, consumer) =>
    __Zs.itField(form, consumer);
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    toForm,
    toFormUi,
    toFieldName,
    toLimit,
    itField,
    valueExpr,
    valueFind,
    // 工作流新数据格式（可重用）
    valueTran,
    valueIndicate,
    // 同名函数
    elementChildTree: (array = [], current = {}, parentField = "parent") =>
        __Zn.elementChildTree(array, current, parentField),
    elementChildren: (array = [], current = {}, parentField = "parent") =>
        __Zn.elementChildren(array, current, parentField),
}