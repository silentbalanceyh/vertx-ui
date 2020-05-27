import Pr from './I.parser';
import U from 'underscore';
import Abs from '../../abyss';

/**
 * ## 引擎函数
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
 * ### 解析器
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
 * @memberOf module:_parser
 * @method parseValue
 * @param {String} valueOrExpr 值处理专用表达式。
 * @param {ReactComponent} reference React对应组件引用。
 * @return {any} 解析过后的值信息。
 */
export default (valueOrExpr, reference) => {
    let value;
    /*
     * 解析基本条件
     * 1）valueOrExpr 不为 undefined
     * 2）valueOfExpr 是一个完整的 string 类型
     * 3）valueOfExpr 中包含了 :
     */
    if (valueOrExpr && ("string" === typeof valueOrExpr)
        && 0 < valueOrExpr.indexOf(":")) {
        /*
         * 解析最终结果
         */
        const parsed = Abs.valueExpr(valueOrExpr);
        /*
         * 去掉 parser 流程，直接执行，以后都不采用 parser 流程处理
         */
        const parser = Pr[parsed.type] ? Pr[parsed.type] : undefined;
        if (U.isFunction(parser)) {
            /*
             * 直接单参数解析
             */
            value = parser(parsed.expression, reference);
        } else {
            /*
             * 未解析的直接为 expression
             */
            console.warn("[ Ux ] 未解析 parsed = ", parsed);
            value = parsed.expression;
        }
    } else {
        /*
         * 原始值可直接解析
         */
        if ("NULL" === valueOrExpr) {
            value = null;
        } else {
            /*
             * 不执行任何解析，value 直接等于原始值
             */
            value = valueOrExpr;
        }
    }
    return value;
};