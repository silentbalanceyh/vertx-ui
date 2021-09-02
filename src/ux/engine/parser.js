// 导入外层执行
import Dev from '../develop';
import T from '../unity';
import Datum from './datum';
import Abs from '../abyss';
import Ele from '../element';
import R from './expression';

const fnPredicate = (type, expression, supplier) => {
    if (expression && "string" === typeof expression) {
        return supplier();
    } else {
        console.error(` [ Ux ] ${type} 解析出错！expression = `, expression);
    }
};
const Pr = {
    NUMBER: (expression) => Ele.valueInt(expression, 0),
    /*
     * BOOL 处理信息
     * 1）前置，（无）
     * 2）后置，直接将值转换成 Bool
     * 格式如：
     * 1）为真的格式：BOOL:true
     * 2）为假的格式：BOOL:false
     */
    BOOL: (expression) => "true" === expression,
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
    FORM: (expression, {props}) => fnPredicate("FORM", expression, () => {
        const {form} = props;
        if (form) {
            return form.getFieldValue(expression);
        }
    }),
    /*
     * DATUM 操作符处理
     * 1）前置，直接解析 expr, source=<v1>
     * 2）后置，直接将解析过后的表达式应用于 props / state （ reference）
     * 格式如：
     * 1）DATUM:source=xxx（直接返回Array)
     * 不支持其他格式，只能 key = value 的格式
     *
     * 具有二义性的解析
     * 1）DATUM:source=xxx 直接构造下拉表
     * 2）DATUM:source=xxx,cond=YYY，其中YYY支持条件（后期使用）
     */
    DATUM: (expression, {props}) => fnPredicate("DATUM", expression, () => {
        const datum = T.formatObject(expression);
        if (datum.source) {
            const keys = Object.keys(datum).length;
            if (1 === keys) {
                /*
                 * 只有 source
                 */
                return Datum.elementFindDatum({props}, datum.source, {});
            } else {
                /*
                 * 包含第二条件
                 */
                // TODO: 暂时不需要，等待后期开发
            }
        } else return null;
    }),
    /*
     * UNIQUE 操作符（ DATUM的变种 ）
     */
    UNIQUE: (expression = "", reference) => fnPredicate("UNIQUE", expression, () => {
        const exprArr = expression.split(',');
        /*
         * 格式：UNIQUE
         * 1）source，如果只有第一部分，等价于 DATUM:source=xxx
         * 2）最终筛选的字段值
         * 3）条件信息（ X -> Value 的递归 ）
         * 条件本身支持解析，但不能像原始的Value一样解析，
         * 3.1）支持格式：BOOL，FIX，UNIQUE，FORM，PROP，STATE
         * 3.2）表达式为：expression`defaultValue，这里的 defaultValue 就是条件字段的专用值
         * 4）默认值：defaultValue
         */
        if (3 <= exprArr.length) {
            /*
             * 可以没有默认值，但必须包含
             * source, field, cond
             */
            const source = exprArr[0];
            if (source) {
                const cond = exprArr[2];                        // 条件处理
                /*
                 * 读取数组
                 */
                let filters = {};
                if (cond) {
                    const condition = cond.split('=');
                    if (2 === condition.length) {
                        /*
                         * 是否包含了默认值部分
                         */
                        let expr;
                        let defaultValue;
                        if (0 < condition[1].indexOf("`")) {
                            expr = condition[1].split('`')[0];
                            defaultValue = condition[1].split('`')[1];
                        } else {
                            expr = condition[1];
                        }
                        /*
                         * 得到 expr 和 defaultValue
                         * 主要根据 cond 中是否包含了 ` 来定义
                         */
                        if (expr) {
                            /*
                             * 默认值逻辑
                             */
                            let value = parseValue(expr, reference);
                            if (!value) {
                                value = defaultValue;
                            }
                            filters[condition[0]] = value;
                            // Dev.dgDebug(filters, "[ Ux ] 值解析过滤信息！");
                        }
                    }
                }
                /*
                 * Unique Find
                 * 查找唯一的记录值
                 */
                const result = Datum.elementFindDatum(reference, source, filters);
                if (1 === result.length) {
                    const hitted = result[0];
                    if (hitted) {
                        const field = exprArr[1] ? exprArr[1] : "key";  // 带有默认值
                        return hitted[field];
                    }
                }
            } else {
                console.error(expression);
                throw new Error("[ Ux ] UNIQUE 表达式格式有问题！");
            }
        }
    }),
    /*
     * PROP 操作符处理
     * 1）前置，直接解析内容：field 或 field.xxx
     * 2）针对后置属性进行解析，如果有路径则直接提取路径
     */
    PROP: (expression, {props}) => fnPredicate("PROP", expression, () => {
        const path = expression.split('.'); // 路径解析
        return T.valueFind(props, path);
    }),
    /*
     * ROUTE 路由值
     * 从 $router 中读取相关信息
     */
    ROUTE: (expression, {props}) => fnPredicate("ROUTE", expression, () => {
        const {$router} = props;
        if ($router) {
            return $router._(expression);
        }
    }),
    /*
     * STATE 状态值
     * 直接从 state 中读取值
     */
    STATE: (expression, {state}) => fnPredicate("STATE", expression, () => {
        const attrPath = expression.split('.');
        if (1 === attrPath.length) {
            const attr = attrPath[0];
            return state[`$${attr}`];
        } else {
            return T.valueFind(state, attrPath);
        }
    }),
    /*
     * 从用户对象中提取数据
     */
    USER: (expression) => {
        const user = T.isLogged();
        if (expression) {
            if (0 < expression.indexOf('.')) {
                const path = expression.split('.');
                const $user = Abs.immutable(user);
                return $user.getIn(path);
            } else {
                return user[expression];
            }
        } else {
            return null;
        }
    },
}
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
 * @memberOf module:_parser
 * @method parseValue
 * @param {String} valueOrExpr 值处理专用表达式。
 * @param {ReactComponent} reference React对应组件引用。
 * @return {any} 解析过后的值信息。
 */
const parseValue = (valueOrExpr, reference) => {
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
        const parsed = Ele.valueParse(valueOrExpr);
        /*
         * 去掉 parser 流程，直接执行，以后都不采用 parser 流程处理
         */
        const parser = Pr[parsed.type] ? Pr[parsed.type] : undefined;
        if (Abs.isFunction(parser)) {
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
 * ## 「引擎」`Ux.parseInput`
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
const parseColumn = (columns = [], reference) => {
    const normalized = [];
    columns.filter(each => "key" !== each.dataIndex).forEach(each => {
        // 选项处理（组件配置）
        const item = {};
        item.value = each.dataIndex;
        item.key = each.dataIndex;
        item.label = each.title;
        item.control = each['$render'] ? each['$render'] : "TEXT";
        // 配置专用
        const config = {};
        if (each['$format']) {
            config.format = each['$format'];
        }
        if (each['$mapping']) {
            config.mapping = each['$mapping'];
        }
        if (each['$expr']) {
            const expr = each["$expr"];
            const expression = {}
            if (expr.startsWith(":value")) {
                // 带后缀
                expression.after = expr.replace(/:value/g, "");
            } else if (expr.endsWith(":value")) {
                // 带前缀
                expression.before = expr.replace(/:value/g, "");
            } else {
                // 前后缀都带
                const kv = expr.split(':value');
                expression.before = kv[0];
                expression.after = kv[1];
            }
            config.expression = expression;
        }
        if (each["$datum"]) {
            const datum = each.$datum;
            config.options = R.Ant.toOptions(reference, {datum});
        }
        item.config = config;
        normalized.push(item);
    });
    return normalized;
}
/*
 * The `ajax.position` to configure the view position here:
 *
 */
const parsePosition = (positionExpr, reference) => {
    const parsed = Ele.ambArray(positionExpr);
    const seed = [];
    parsed.forEach(eachExpr => {
        seed.push(parseValue(eachExpr, reference));
    })
    // Join后的结果
    const literal = seed.join(":");
    return T.encryptMD5(literal);
}
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    parseField,
    parseInput,
    parseValue,
    parseColumn,
    parsePosition,
}