import UNIQUE from './I.fn.unique';
import ROUTE from './I.fn.router';
import PROP from './I.fn.prop';
import DATUM from './I.fn.datum';
import FORM from './I.fn.form';
import STATE from './I.fn.state';
import USER from './I.fn.user';
/* 渗透处理 */

export default {
    /*
     * BOOL 处理信息
     * 1）前置，（无）
     * 2）后置，直接将值转换成 Bool
     * 格式如：
     * 1）为真的格式：BOOL:true
     * 2）为假的格式：BOOL:false
     */
    BOOL: (expression) => Boolean(expression),
    /*
     * OPERATOR 操作符处理
     * 1）前置，（无）
     * 2）后置，直接判断是否等于 AND
     * 格式如：
     * 1）OPERATOR:AND （并）
     * 2）OPERATOR:OR （或）
     *
     */
    OPERATOR: (expression) => "AND" === expression,
    /*
     * FIX 固定值
     * 1）前置，直接解析成 expr，替换处理
     * 2）后置，直接返回最终结果，是多少返回多少
     */
    FIX: (expression) => expression,
    /*
     * DELAY 比较特殊，它主要是针对 一些后处理数据执行操作
     * *：当前输入的字段值受到 form 的限制，在初始化的时候由于 ant-design 的 form还没有执行初始化，所以无值，
     * 这种情况，利用 DELAY 在 render 流程中执行二次处理
     */
    DELAY: (expression) => ({
        expression,
        $delay: true,
    }),
    /*
     * ENUM 枚举处理
     * 1）前置，直接解析成 expr，替换处理
     * 2）后置，只支持固定值，如：a`b`c 最终解析成 ["a","b","c"]
     */
    ENUM: (expression) => expression.split('`'),
    /*
     * FORM 表单值
     * 直接从 form 中读取相关值
     */
    FORM,
    /*
     * DATUM 操作符处理
     * 1）前置，直接解析 expr, source=<v1>
     * 2）后置，直接将解析过后的表达式应用于 props / state （ reference）
     * 格式如：
     * 1）DATUM:source=xxx（直接返回Array)
     * 不支持其他格式，只能 key = value 的格式
     */
    DATUM,
    /*
     * UNIQUE 操作符（ DATUM的变种 ）
     */
    UNIQUE,
    /*
     * PROP 操作符处理
     * 1）前置，直接解析内容：field 或 field.xxx
     * 2）针对后置属性进行解析，如果有路径则直接提取路径
     */
    PROP,
    /*
     * ROUTE 路由值
     * 从 $router 中读取相关信息
     */
    ROUTE,
    /*
     * STATE 状态值
     * 直接从 state 中读取值
     */
    STATE,
    /*
     * 从用户对象中提取数据
     */
    USER,
}