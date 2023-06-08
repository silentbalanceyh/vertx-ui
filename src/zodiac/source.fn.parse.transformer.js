import __Zn from './zero.module.dependency';
import __DQR from './source.datum.fn.element.qr';
import __APP from './store.fn.is.configuration';
import __FORM from './form.fn.form.action';

const fnPredicate = (type, expression, supplier) => {
    if (expression && "string" === typeof expression) {
        return supplier();
    } else {
        console.error(` [ Ux ] ${type} 解析出错！expression = `, expression);
    }
};

const __PARSER = {
    OPTION: (expression, {option}) => {
        if (option) {
            return option[expression];
        } else {
            return null;
        }
    },
    NUMBER: (expression) => __Zn.valueInt(expression, 0),
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
    FORM: (expression, reference, addOn = {}) => fnPredicate("FORM", expression, () => {
        let formValue = __FORM.formGet(reference, expression, false);
        if (!formValue) {
            // 有可能是无值处理，只有无值的时候处理第一下拉表
            const {initialize = {}} = addOn;
            formValue = initialize[expression];
        }
        return formValue;
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
    DATUM: (expression, reference) => fnPredicate("DATUM", expression, () => {
        const datum = __Zn.formatObject(expression);
        if (datum.source) {
            const keys = Object.keys(datum).length;
            if (1 === keys) {
                /*
                 * 只有 source
                 */
                return __DQR.elementFindDatum(reference, datum.source, {});
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
                const result = __DQR.elementFindDatum(reference, source, filters);
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
        return __Zn.valueFind(props, path);
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
            return __Zn.valueFind(state, attrPath);
        }
    }),
    /*
     * 从用户对象中提取数据
     */
    USER: (expression) => {
        const user = __APP.isLogged();
        if (expression) {
            if (0 < expression.indexOf('.')) {
                const path = expression.split('.');
                const $user = __Zn.immutable(user);
                return $user.getIn(path);
            } else {
                return user[expression];
            }
        } else {
            return null;
        }
    },
}
const parseValue = (valueOrExpr, reference, adjustment = {}) => {
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
        const parsed = __Zn.valueParse(valueOrExpr);
        /*
         * 去掉 parser 流程，直接执行，以后都不采用 parser 流程处理
         */
        const parser = __PARSER[parsed.type] ? __PARSER[parsed.type] : undefined;
        if (__Zn.isFunction(parser)) {
            /*
             * 直接单参数解析
             */
            value = parser(parsed.expression, reference, adjustment);
        } else {
            /*
             * 未解析的直接为 expression
             */
            console.info("[ Ux ] 未解析 parsed = ", parsed);
            value = valueOrExpr;
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
export default {
    parseValue,
}