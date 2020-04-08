// 导入当前目录
import parseValue from './I.fn.value';
// 导入外层
import Dev from '../../develop';

/**
 * ## 引擎函数
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
 * @memberOf module:_parser
 * @param {String} input 输入查询字段表达式。
 * @return {Object}
 */
const parseField = (input) => {
    let op = "=";
    let field;
    if (0 < input.indexOf(',')) {
        /*
         * 带符号
         */
        const parsed = input.replace(/ /g, '').split(',');
        field = parsed[0];
        op = parsed[1];
        if (!op) op = "=";   // 默认是等号
    } else {
        /*
         * 不带符号
         */
        field = input;
    }
    return {op, field};
};
/**
 * ## 引擎函数
 *
 * 针对Object中的字段和值对应的合并解析流程，解析完整对象，每个对象的值执行一次`parseValue`解析。
 *
 * @memberOf module:_parser
 * @param {Object} input 传入的数据相关值信息。
 * @param {Props} props 当前组件的属性信息。
 * @param {State} state 当前组件的状态信息。
 * @return {Object} 解析的最终结果值。
 */
const parseInput = (input = {}, {props, state}) => {
    // 查找根节点
    const parsed = {};
    Object.keys(input)
        .filter(field => undefined !== input[field])
        .forEach(field => {
            const value = parseValue(input[field], {state, props});
            if (undefined !== value) {        // value 不为 undefined 就处理
                parsed[field] = value;
            }
        });
    Dev.dgDebug(parsed, "[ Ux ] 参数分析最终结果：", "black");
    return parsed;
};
export default {
    parseField,
    parseValue,
    parseInput,
}