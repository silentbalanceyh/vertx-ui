import Expr from "./O.format";
import Ele from "../element";
import Abs from "../abyss";

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
 * @memberOf module:_value
 * @param {String} expr 传入的表达式或字段名。
 * @param {Object} data 记录信息。
 * @param {boolean} keep 格式化过后是否保留原始的值的。
 * @return {string} 返回最终格式化后的数据。
 */
const valueExpr = (expr = "", data = {}, keep = false) => {
    let display = "";
    if (0 <= expr.indexOf(":")) {
        display = Expr.formatExpr(expr, data, keep);
    } else {
        display = data[expr];
        if (!display) display = "";
    }
    return display;
};


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
 * @memberOf module:_value
 * @param {any} target 被查找的引用信息。
 * @param {Array} attrPath 属性路径信息。
 * @return {any|*} 返回最终解析的属性值。
 */
const valueFind = (target = {}, attrPath = []) => {
    if (2 <= attrPath.length) {
        const targetKey = attrPath[0];
        const name = attrPath[1];
        if (targetKey && name) {
            return Ele.ambFind(target, `$${targetKey}`, attrPath[1]);
        } else {
            console.error(`[ Ux ] 解析的配置不对，key = $${targetKey}, name = ${name}`);
        }
    } else {
        if (1 === attrPath.length) {
            /*
             * 长度为1，直接提取
             */
            const targetKey = attrPath[0];
            return target[targetKey];
        } else {
            console.error(`[ Ux ] 解析表达式有问题，请检查：$${target}`);
        }
    }
};

/**
 * ## 「引擎」`Ux.toForm`
 *
 * 将两个form的配置进行合并的专用操作，主要合并项：
 *
 * 1. ui：两个表单直接连接。
 * 2. hidden：两个表单的隐藏字段连接。
 * 3. initial：初始值二者合并。
 * 4. mapping：映射值二者合并。
 *
 * @memberOf module:_to
 * @param {Object} staticForm 静态表单配置。
 * @param {Object} dynamicForm 动态表单配置。
 * @return {Object} 返回最终的表单配置。
 */
const toForm = (staticForm = {}, dynamicForm = {}) => {
    /*
     * form：输入的 form
     * dynamicForm：动态输入的 form
     * 1）执行 ui 的合并
     * 2）执行 hidden 的合并
     * 3）执行 initial 的合并
     * 4）执行 op 的合并
     * 5）执行 mapping 的合并
     */
    // 先执行拷贝
    const form = staticForm ? Abs.clone(staticForm) : {};
    /*
     * 动态中的属性优先
     */
    const {ui = [], hidden = [], initial = {}, mapping = {}, ...rest} = dynamicForm;
    if (!Abs.isEmpty(rest)) {
        Object.assign(form, rest);
    }
    /*
     * 合并 ui 项
     */
    if (Abs.isArray(ui) && 0 < ui.length) {
        if (!form.ui) form.ui = [];
        form.ui = [].concat(form.ui, ui);
    }
    if (Abs.isArray(hidden) && 0 < hidden.length) {
        if (!form.hidden) form.hidden = [];      // 防止原生未配置
        form.hidden = [].concat(form.hidden, hidden);
    }
    /*
     * mapping 和 initial
     */
    if (!Abs.isEmpty(initial)) {
        if (!form.initial) form.initial = {};
        Object.assign(form.initial, initial);
    }
    if (!Abs.isEmpty(mapping)) {
        if (!form.mapping) form.mapping = {};
        Object.assign(form.mapping, mapping);
    }
    return form;
};

/**
 * ## 「引擎」`Ux.toLimit`
 *
 * 功能和 `valueLimit`相同，同样的执行操作，用于不同的场景。
 *
 * * `valueLimit` 属于标准函数。
 * * `toLimit` 在自定义组件中调用。
 *
 * @memberOf module:_to
 * @param {Props} props React组件的属性值。
 * @param {Array} limits 需要限制的 keys 的值。
 * @return {Object} 返回限制过后的属性值。
 */
const toLimit = (props = {}, limits = []) => {
    const inherits = {};
    const $limitKeys = Abs.immutable(limits);
    Object.keys(props).filter(key => !$limitKeys.contains(key))
        .forEach(key => inherits[key] = props[key]);
    return inherits;
};
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    toForm,
    toLimit,
    valueExpr,
    valueFind,
    // 同名函数
    elementChildTree: (array = [], current = {}, parentField = "parent") =>
        Ele.elementChildTree(array, current, parentField),
    elementChildren: (array = [], current = {}, parentField = "parent") =>
        Ele.elementChildren(array, current, parentField),
}