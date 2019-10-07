import Cmn from './I.common';
import Datum from '../datum';
import parseValue from './I.fn.value';

export default (expression = "", reference) => Cmn.fnPredicate("UNIQUE", expression, () => {
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
})