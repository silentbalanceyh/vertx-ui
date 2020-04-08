import Expr from "./O.format";
import Ele from "../element";

/**
 * ## 特殊函数「Zero」
 *
 * 解析表达式强化方法，主要用于解析Zero中带`:`的自定义表达式相关信息。
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
 * ## 特殊函数「Zero」
 *
 * 配置解析统一调用函数
 *
 * 1. 如果 attrPath 长度为1，则直接提取 target 中的：`target[attrPath[0]]`。
 * 2. 如果长度大于2，则先提取`target[attrPath[0]]`，其次提取第二阶段名称，暂时只支持长度为2的模式。
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
            return Ele.ambiguityFind(target, `$${targetKey}`, attrPath[1]);
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
export default {
    valueExpr,
    valueFind
}